-- Add first_name and last_name columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name text NOT NULL DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name text NOT NULL DEFAULT '';

-- Backfill: split existing display_name into first/last
UPDATE public.profiles
SET first_name = split_part(display_name, ' ', 1),
    last_name  = CASE
      WHEN position(' ' in display_name) > 0
      THEN substring(display_name from position(' ' in display_name) + 1)
      ELSE ''
    END
WHERE first_name = '' AND display_name != '';

-- Update the handle_new_user trigger to set first_name and last_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Check if an invited profile with this email already exists
  IF EXISTS (SELECT 1 FROM public.profiles WHERE email = new.email AND id != new.id) THEN
    UPDATE public.profiles SET id = new.id, updated_at = now()
    WHERE email = new.email AND id != new.id;
  ELSE
    INSERT INTO public.profiles (id, display_name, first_name, last_name, email)
    VALUES (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
      coalesce(new.raw_user_meta_data ->> 'first_name', split_part(new.email, '@', 1)),
      coalesce(new.raw_user_meta_data ->> 'last_name', ''),
      new.email
    );
  END IF;
  RETURN new;
END;
$$;
