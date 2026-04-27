// Arena client — thin wrapper around the Supabase RPCs and realtime channels
// that power live PvP matchmaking. All writes go through SECURITY DEFINER RPCs
// (defined in the database migrations), so the client only needs the anon key.
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ArenaMode = "quick" | "ranked" | "friend";

export type QueueRow = Database["public"]["Tables"]["arena_queue"]["Row"];
export type MatchRow = Database["public"]["Tables"]["arena_matches"]["Row"];
export type MatchPlayerRow = Database["public"]["Tables"]["arena_match_players"]["Row"];
export type BattleEventRow = Database["public"]["Tables"]["arena_battle_events"]["Row"];
export type ChatRow = Database["public"]["Tables"]["arena_chat_messages"]["Row"];

export interface JoinQueueArgs {
  walletAddress: string;
  playerName: string;
  mode: ArenaMode;
  selectedPetId: string;
  selectedSpeciesId: string;
  petSnapshot: Record<string, unknown>;
  rating?: number;
  roomCode?: string;
}

export interface JoinQueueResult {
  queueId: string;
  matchId: string | null;
  status: "queued" | "matched";
}

export async function joinQueue(args: JoinQueueArgs): Promise<JoinQueueResult> {
  const rpcArgs: {
    p_wallet_address: string;
    p_player_name: string;
    p_mode: string;
    p_selected_pet_id: string;
    p_selected_species_id: string;
    p_pet_snapshot: never;
    p_rating: number;
    p_room_code?: string;
  } = {
    p_wallet_address: args.walletAddress,
    p_player_name: args.playerName,
    p_mode: args.mode,
    p_selected_pet_id: args.selectedPetId,
    p_selected_species_id: args.selectedSpeciesId,
    p_pet_snapshot: args.petSnapshot as never,
    p_rating: args.rating ?? 1000,
  };
  if (args.roomCode) rpcArgs.p_room_code = args.roomCode;
  const { data, error } = await supabase.rpc("join_arena_queue", rpcArgs);
  if (error) throw new Error(error.message);
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) throw new Error("join_arena_queue returned no row");
  return {
    queueId: row.queue_id as string,
    matchId: (row.match_id as string | null) ?? null,
    status: row.status as "queued" | "matched",
  };
}

export async function cancelQueue(walletAddress: string): Promise<number> {
  const { data, error } = await supabase.rpc("cancel_arena_queue", {
    p_wallet_address: walletAddress,
  });
  if (error) throw new Error(error.message);
  return (data as number | null) ?? 0;
}

export interface SubmitMoveArgs {
  matchId: string;
  walletAddress: string;
  move: "rock" | "paper" | "scissors" | "basic" | "skill" | "ultimate" | "defend";
  payload?: Record<string, unknown>;
}

export async function submitMove(args: SubmitMoveArgs): Promise<string> {
  const { data, error } = await supabase.rpc("submit_arena_move", {
    p_match_id: args.matchId,
    p_wallet_address: args.walletAddress,
    p_move: args.move,
    p_payload: (args.payload ?? {}) as never,
  });
  if (error) throw new Error(error.message);
  return data as string;
}

export async function postChat(args: {
  matchId: string;
  walletAddress: string;
  playerName: string;
  message?: string;
  emoji?: string;
}): Promise<string> {
  const rpcArgs: {
    p_match_id: string;
    p_wallet_address: string;
    p_player_name: string;
    p_message?: string;
    p_emoji?: string;
  } = {
    p_match_id: args.matchId,
    p_wallet_address: args.walletAddress,
    p_player_name: args.playerName,
  };
  if (args.message) rpcArgs.p_message = args.message;
  if (args.emoji) rpcArgs.p_emoji = args.emoji;
  const { data, error } = await supabase.rpc("post_arena_chat", rpcArgs);
  if (error) throw new Error(error.message);
  return data as string;
}

export async function fetchMatch(matchId: string): Promise<MatchRow | null> {
  const { data, error } = await supabase
    .from("arena_matches")
    .select("*")
    .eq("id", matchId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchMatchPlayers(matchId: string): Promise<MatchPlayerRow[]> {
  const { data, error } = await supabase
    .from("arena_match_players")
    .select("*")
    .eq("match_id", matchId);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchBattleEvents(matchId: string): Promise<BattleEventRow[]> {
  const { data, error } = await supabase
    .from("arena_battle_events")
    .select("*")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Subscribe to a single queue row by its id (resolves a `matched` transition). */
export function subscribeQueue(queueId: string, onChange: (row: QueueRow) => void) {
  const channel = supabase
    .channel(`arena-queue-${queueId}`)
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "arena_queue", filter: `id=eq.${queueId}` },
      (payload) => onChange(payload.new as QueueRow),
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

/** Subscribe to all live signals for a single match: status, events, chat. */
export function subscribeMatch(
  matchId: string,
  handlers: {
    onMatch?: (row: MatchRow) => void;
    onPlayer?: (row: MatchPlayerRow) => void;
    onEvent?: (row: BattleEventRow) => void;
    onChat?: (row: ChatRow) => void;
  },
) {
  const channel = supabase
    .channel(`arena-match-${matchId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "arena_matches", filter: `id=eq.${matchId}` },
      (payload) => handlers.onMatch?.(payload.new as MatchRow),
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "arena_match_players", filter: `match_id=eq.${matchId}` },
      (payload) => handlers.onPlayer?.(payload.new as MatchPlayerRow),
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "arena_battle_events", filter: `match_id=eq.${matchId}` },
      (payload) => handlers.onEvent?.(payload.new as BattleEventRow),
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "arena_chat_messages", filter: `match_id=eq.${matchId}` },
      (payload) => handlers.onChat?.(payload.new as ChatRow),
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

/** Live online queue size (lightweight head count for the lobby). */
export async function fetchQueueSize(mode: ArenaMode): Promise<number> {
  const { count, error } = await supabase
    .from("arena_queue")
    .select("id", { count: "exact", head: true })
    .eq("status", "queued")
    .eq("mode", mode);
  if (error) return 0;
  return count ?? 0;
}