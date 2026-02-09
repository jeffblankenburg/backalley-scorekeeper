-- 003: Friends table + allow profiles without auth.users (invited players)
--
-- This migration:
-- 1. Drops FK from profiles → auth.users so profiles can exist without an auth account
-- 2. Re-points all user_id FKs to reference profiles (not auth.users) with ON UPDATE CASCADE
-- 3. Creates the friends table
-- 4. Adds INSERT policy on profiles (so authenticated users can create invited players)
-- 5. Updates the handle_new_user trigger to merge invited profiles on signup

-- ── 1. Drop profiles FK to auth.users ──────────────────────────────────────
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- ── 2. Re-point FKs to profiles with ON UPDATE CASCADE ─────────────────────
ALTER TABLE public.game_players DROP CONSTRAINT IF EXISTS game_players_user_id_fkey;
ALTER TABLE public.game_players ADD CONSTRAINT game_players_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON UPDATE CASCADE;

ALTER TABLE public.rounds DROP CONSTRAINT IF EXISTS rounds_dealer_user_id_fkey;
ALTER TABLE public.rounds ADD CONSTRAINT rounds_dealer_user_id_fkey
  FOREIGN KEY (dealer_user_id) REFERENCES public.profiles(id) ON UPDATE CASCADE;

ALTER TABLE public.player_rounds DROP CONSTRAINT IF EXISTS player_rounds_user_id_fkey;
ALTER TABLE public.player_rounds ADD CONSTRAINT player_rounds_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON UPDATE CASCADE;

ALTER TABLE public.games DROP CONSTRAINT IF EXISTS games_created_by_fkey;
ALTER TABLE public.games ADD CONSTRAINT games_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES public.profiles(id);

-- ── 3. Create friends table ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.friends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE,
  friend_id uuid NOT NULL REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

CREATE INDEX IF NOT EXISTS idx_friends_user_id ON public.friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend_id ON public.friends(friend_id);

ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own friends"
  ON public.friends FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can add friends"
  ON public.friends FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove friends"
  ON public.friends FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ── 4. Allow authenticated users to insert profiles ────────────────────────
CREATE POLICY "Authenticated users can insert profiles"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (true);

-- ── 5. Update trigger to merge invited profiles on signup ──────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- If an invited profile with this email exists, update its ID to match auth user
  IF EXISTS (SELECT 1 FROM public.profiles WHERE email = NEW.email AND id != NEW.id) THEN
    UPDATE public.profiles SET id = NEW.id, updated_at = now()
    WHERE email = NEW.email AND id != NEW.id;
  ELSE
    INSERT INTO public.profiles (id, display_name, email)
    VALUES (
      NEW.id,
      coalesce(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)),
      NEW.email
    );
  END IF;
  RETURN NEW;
END;
$$;
