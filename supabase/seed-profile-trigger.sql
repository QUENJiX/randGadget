-- ============================================================================
-- GADGETBD: Profile creation trigger
-- Run AFTER schema.sql
-- Auto-creates a `profiles` row when a new user signs up via Supabase Auth.
-- ============================================================================

-- Function: copies user metadata into the profiles table
-- NOTE: SET search_path = public is required so the function can resolve
-- the profiles table when invoked internally by Supabase Auth (GoTrue).
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
EXCEPTION WHEN others THEN
  -- Log but don't block user creation if profile insert fails
  RAISE LOG 'handle_new_user failed for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Trigger: fires after every auth.users INSERT
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Also allow users to INSERT their own profile (needed for upsert patterns)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
