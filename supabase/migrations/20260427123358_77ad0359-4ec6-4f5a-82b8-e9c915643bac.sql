-- Grant execute on the SECURITY DEFINER RPCs so the browser (anon/authenticated) can call them.
-- The functions themselves validate inputs and run with definer privileges, so this is safe.
GRANT EXECUTE ON FUNCTION public.join_arena_queue(text, text, text, text, text, jsonb, integer, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_arena_queue(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_arena_move(uuid, text, text, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.post_arena_chat(uuid, text, text, text, text) TO anon, authenticated;

-- Enable realtime on the arena tables so the client can subscribe to changes.
ALTER PUBLICATION supabase_realtime ADD TABLE public.arena_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.arena_matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.arena_match_players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.arena_battle_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.arena_chat_messages;

-- Make sure realtime emits full row payloads (needed for UPDATE events).
ALTER TABLE public.arena_queue REPLICA IDENTITY FULL;
ALTER TABLE public.arena_matches REPLICA IDENTITY FULL;
ALTER TABLE public.arena_match_players REPLICA IDENTITY FULL;
ALTER TABLE public.arena_battle_events REPLICA IDENTITY FULL;
ALTER TABLE public.arena_chat_messages REPLICA IDENTITY FULL;