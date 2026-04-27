REVOKE EXECUTE ON FUNCTION public.join_arena_queue(text, text, text, text, text, jsonb, integer, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cancel_arena_queue(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.submit_arena_move(uuid, text, text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.post_arena_chat(uuid, text, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.join_arena_queue(text, text, text, text, text, jsonb, integer, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.cancel_arena_queue(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.submit_arena_move(uuid, text, text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.post_arena_chat(uuid, text, text, text, text) TO service_role;