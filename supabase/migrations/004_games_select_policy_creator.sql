-- 004: Allow game creator to see their own games immediately after creation
-- The old policy only checked game_players, but game_players haven't been
-- inserted yet when the INSERT...RETURNING fires.

DROP POLICY IF EXISTS "Games viewable by participants" ON public.games;

CREATE POLICY "Games viewable by participants or creator"
  ON public.games FOR SELECT
  TO authenticated
  USING (id IN (SELECT public.user_game_ids()) OR created_by = auth.uid());
