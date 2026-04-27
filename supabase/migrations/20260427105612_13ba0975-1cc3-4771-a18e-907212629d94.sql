CREATE TABLE IF NOT EXISTS public.wallet_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL UNIQUE,
  display_name text NOT NULL,
  avatar_species_id text,
  rating integer NOT NULL DEFAULT 1000,
  rank_label text NOT NULL DEFAULT 'Bronze',
  wins integer NOT NULL DEFAULT 0,
  losses integer NOT NULL DEFAULT 0,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.arena_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL,
  player_name text NOT NULL,
  mode text NOT NULL CHECK (mode IN ('casual', 'ranked', 'tournament', 'custom')),
  selected_pet_id text NOT NULL,
  selected_species_id text NOT NULL,
  rating integer NOT NULL DEFAULT 1000,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'matched', 'cancelled', 'expired')),
  room_code text,
  estimated_wait_seconds integer NOT NULL DEFAULT 5,
  matched_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_arena_queue_status_mode_created ON public.arena_queue(status, mode, created_at);
CREATE INDEX IF NOT EXISTS idx_arena_queue_wallet ON public.arena_queue(wallet_address);

CREATE TABLE IF NOT EXISTS public.arena_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mode text NOT NULL CHECK (mode IN ('casual', 'ranked', 'tournament', 'custom')),
  status text NOT NULL DEFAULT 'found' CHECK (status IN ('found', 'active', 'complete', 'abandoned')),
  room_code text,
  seed text NOT NULL,
  turn_number integer NOT NULL DEFAULT 1,
  active_wallet_address text,
  turn_deadline_at timestamptz,
  winner_wallet_address text,
  replay jsonb NOT NULL DEFAULT '[]'::jsonb,
  xp_awarded integer NOT NULL DEFAULT 0,
  token_awarded numeric NOT NULL DEFAULT 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_arena_matches_status_created ON public.arena_matches(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_arena_matches_room_code ON public.arena_matches(room_code);

CREATE TABLE IF NOT EXISTS public.arena_match_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.arena_matches(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  player_name text NOT NULL,
  side text NOT NULL CHECK (side IN ('alpha', 'omega')),
  selected_pet_id text NOT NULL,
  selected_species_id text NOT NULL,
  pet_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  current_hp integer NOT NULL DEFAULT 100,
  current_energy integer NOT NULL DEFAULT 2,
  rating_before integer NOT NULL DEFAULT 1000,
  rating_after integer,
  connected_at timestamptz,
  locked_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(match_id, wallet_address),
  UNIQUE(match_id, side)
);

CREATE INDEX IF NOT EXISTS idx_arena_match_players_wallet ON public.arena_match_players(wallet_address);

CREATE TABLE IF NOT EXISTS public.arena_battle_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.arena_matches(id) ON DELETE CASCADE,
  turn_number integer NOT NULL,
  wallet_address text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('coin_toss', 'move_submitted', 'move_resolved', 'status_tick', 'ko', 'forfeit', 'reward')),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_arena_battle_events_match_turn ON public.arena_battle_events(match_id, turn_number, created_at);

CREATE TABLE IF NOT EXISTS public.arena_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.arena_matches(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  player_name text NOT NULL,
  message text,
  emoji text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT arena_chat_has_content CHECK (message IS NOT NULL OR emoji IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_arena_chat_messages_match_created ON public.arena_chat_messages(match_id, created_at);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_wallet_profiles_updated_at ON public.wallet_profiles;
CREATE TRIGGER update_wallet_profiles_updated_at
BEFORE UPDATE ON public.wallet_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_arena_queue_updated_at ON public.arena_queue;
CREATE TRIGGER update_arena_queue_updated_at
BEFORE UPDATE ON public.arena_queue
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_arena_matches_updated_at ON public.arena_matches;
CREATE TRIGGER update_arena_matches_updated_at
BEFORE UPDATE ON public.arena_matches
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.wallet_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_match_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_battle_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Arena profiles are visible" ON public.wallet_profiles;
CREATE POLICY "Arena profiles are visible"
ON public.wallet_profiles
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Arena queue is visible" ON public.arena_queue;
CREATE POLICY "Arena queue is visible"
ON public.arena_queue
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Arena matches are visible" ON public.arena_matches;
CREATE POLICY "Arena matches are visible"
ON public.arena_matches
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Arena match players are visible" ON public.arena_match_players;
CREATE POLICY "Arena match players are visible"
ON public.arena_match_players
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Arena battle events are visible" ON public.arena_battle_events;
CREATE POLICY "Arena battle events are visible"
ON public.arena_battle_events
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Arena chat is visible" ON public.arena_chat_messages;
CREATE POLICY "Arena chat is visible"
ON public.arena_chat_messages
FOR SELECT
USING (true);

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.arena_queue;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.arena_matches;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.arena_match_players;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.arena_battle_events;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.arena_chat_messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;