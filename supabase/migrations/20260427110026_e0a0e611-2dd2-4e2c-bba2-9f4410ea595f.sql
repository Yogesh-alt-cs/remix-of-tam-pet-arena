CREATE OR REPLACE FUNCTION public.join_arena_queue(
  p_wallet_address text,
  p_player_name text,
  p_mode text,
  p_selected_pet_id text,
  p_selected_species_id text,
  p_pet_snapshot jsonb DEFAULT '{}'::jsonb,
  p_rating integer DEFAULT 1000,
  p_room_code text DEFAULT NULL
)
RETURNS TABLE(queue_id uuid, match_id uuid, status text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  opponent public.arena_queue%ROWTYPE;
  own_queue_id uuid;
  new_match_id uuid;
  seed text;
  starter text;
  side_for_self text;
BEGIN
  INSERT INTO public.wallet_profiles(wallet_address, display_name, avatar_species_id, rating, last_seen_at)
  VALUES (lower(p_wallet_address), p_player_name, p_selected_species_id, p_rating, now())
  ON CONFLICT (wallet_address) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    avatar_species_id = EXCLUDED.avatar_species_id,
    last_seen_at = now(),
    updated_at = now();

  UPDATE public.arena_queue
  SET status = 'cancelled', updated_at = now()
  WHERE lower(wallet_address) = lower(p_wallet_address)
    AND status = 'queued';

  SELECT * INTO opponent
  FROM public.arena_queue
  WHERE status = 'queued'
    AND mode = p_mode
    AND lower(wallet_address) <> lower(p_wallet_address)
    AND (p_room_code IS NULL OR room_code = p_room_code)
  ORDER BY created_at ASC
  FOR UPDATE SKIP LOCKED
  LIMIT 1;

  INSERT INTO public.arena_queue(wallet_address, player_name, mode, selected_pet_id, selected_species_id, rating, status, room_code, estimated_wait_seconds)
  VALUES (lower(p_wallet_address), p_player_name, p_mode, p_selected_pet_id, p_selected_species_id, p_rating, 'queued', p_room_code, 5)
  RETURNING id INTO own_queue_id;

  IF opponent.id IS NULL THEN
    queue_id := own_queue_id;
    match_id := NULL;
    status := 'queued';
    RETURN NEXT;
    RETURN;
  END IF;

  seed := encode(gen_random_bytes(16), 'hex');
  IF (get_byte(gen_random_bytes(1), 0) % 2) = 0 THEN
    starter := lower(p_wallet_address);
    side_for_self := 'alpha';
  ELSE
    starter := lower(opponent.wallet_address);
    side_for_self := 'omega';
  END IF;

  INSERT INTO public.arena_matches(mode, status, room_code, seed, active_wallet_address, turn_deadline_at, started_at)
  VALUES (p_mode, 'active', p_room_code, seed, starter, now() + interval '15 seconds', now())
  RETURNING id INTO new_match_id;

  INSERT INTO public.arena_match_players(match_id, wallet_address, player_name, side, selected_pet_id, selected_species_id, pet_snapshot, current_hp, current_energy, rating_before, connected_at)
  VALUES
    (new_match_id, lower(p_wallet_address), p_player_name, side_for_self, p_selected_pet_id, p_selected_species_id, p_pet_snapshot, COALESCE((p_pet_snapshot->'stats'->>'hp')::integer, 100), 2, p_rating, now()),
    (new_match_id, lower(opponent.wallet_address), opponent.player_name, CASE WHEN side_for_self = 'alpha' THEN 'omega' ELSE 'alpha' END, opponent.selected_pet_id, opponent.selected_species_id, '{}'::jsonb, 100, 2, opponent.rating, now());

  INSERT INTO public.arena_battle_events(match_id, turn_number, wallet_address, event_type, payload)
  VALUES (new_match_id, 1, starter, 'coin_toss', jsonb_build_object('starter', starter, 'seed', seed));

  UPDATE public.arena_queue
  SET status = 'matched', matched_id = new_match_id, updated_at = now()
  WHERE id IN (own_queue_id, opponent.id);

  queue_id := own_queue_id;
  match_id := new_match_id;
  status := 'matched';
  RETURN NEXT;
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_arena_queue(p_wallet_address text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  changed integer;
BEGIN
  UPDATE public.arena_queue
  SET status = 'cancelled', updated_at = now()
  WHERE lower(wallet_address) = lower(p_wallet_address)
    AND status = 'queued';
  GET DIAGNOSTICS changed = ROW_COUNT;
  RETURN changed;
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_arena_move(
  p_match_id uuid,
  p_wallet_address text,
  p_move text,
  p_payload jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_match public.arena_matches%ROWTYPE;
  opponent_wallet text;
  event_id uuid;
BEGIN
  SELECT * INTO current_match
  FROM public.arena_matches
  WHERE id = p_match_id
  FOR UPDATE;

  IF current_match.id IS NULL THEN
    RAISE EXCEPTION 'match_not_found';
  END IF;

  IF current_match.status <> 'active' THEN
    RAISE EXCEPTION 'match_not_active';
  END IF;

  IF lower(current_match.active_wallet_address) <> lower(p_wallet_address) THEN
    RAISE EXCEPTION 'not_active_turn';
  END IF;

  SELECT wallet_address INTO opponent_wallet
  FROM public.arena_match_players
  WHERE match_id = p_match_id
    AND lower(wallet_address) <> lower(p_wallet_address)
  LIMIT 1;

  INSERT INTO public.arena_battle_events(match_id, turn_number, wallet_address, event_type, payload)
  VALUES (p_match_id, current_match.turn_number, lower(p_wallet_address), 'move_submitted', p_payload || jsonb_build_object('move', p_move))
  RETURNING id INTO event_id;

  UPDATE public.arena_matches
  SET turn_number = current_match.turn_number + 1,
      active_wallet_address = opponent_wallet,
      turn_deadline_at = now() + interval '15 seconds',
      updated_at = now()
  WHERE id = p_match_id;

  RETURN event_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.post_arena_chat(
  p_match_id uuid,
  p_wallet_address text,
  p_player_name text,
  p_message text DEFAULT NULL,
  p_emoji text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  chat_id uuid;
BEGIN
  INSERT INTO public.arena_chat_messages(match_id, wallet_address, player_name, message, emoji)
  VALUES (p_match_id, lower(p_wallet_address), p_player_name, NULLIF(left(coalesce(p_message, ''), 240), ''), NULLIF(left(coalesce(p_emoji, ''), 16), ''))
  RETURNING id INTO chat_id;
  RETURN chat_id;
END;
$$;