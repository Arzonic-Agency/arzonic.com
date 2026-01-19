-- ============================================================================
-- PUSH NOTIFICATIONS SETUP FOR ARZONIC.COM
-- ============================================================================
-- Kør denne SQL i din Supabase SQL Editor
-- ============================================================================

-- 1. Opret push_subscriptions tabel
-- ============================================================================
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for hurtigere opslag
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id
  ON push_subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint
  ON push_subscriptions(endpoint);

-- ============================================================================
-- 2. Tilføj push_notifications_enabled kolonne til members tabel
-- ============================================================================
-- Tjek om kolonnen allerede findes, og tilføj den hvis ikke
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'members'
    AND column_name = 'push_notifications_enabled'
  ) THEN
    ALTER TABLE members
    ADD COLUMN push_notifications_enabled BOOLEAN DEFAULT true;
  END IF;
END $$;

-- ============================================================================
-- 3. RLS (Row Level Security) Policies
-- ============================================================================

-- Enable RLS på push_subscriptions
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Brugere kan se deres egne subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON push_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Brugere kan indsætte subscriptions
CREATE POLICY "Users can insert subscriptions"
  ON push_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Brugere kan opdatere deres egne subscriptions
CREATE POLICY "Users can update own subscriptions"
  ON push_subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Brugere kan slette deres egne subscriptions
CREATE POLICY "Users can delete own subscriptions"
  ON push_subscriptions
  FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Service role (admin) kan gøre alt
CREATE POLICY "Service role can do everything"
  ON push_subscriptions
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================================
-- 4. RLS Policy for members.push_notifications_enabled
-- ============================================================================

-- Policy: Brugere kan opdatere deres egen push_notifications_enabled
DROP POLICY IF EXISTS "Users can update own push notification preference" ON members;
CREATE POLICY "Users can update own push notification preference"
  ON members
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 5. Trigger til at opdatere updated_at automatisk
-- ============================================================================

-- Opret eller erstat trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tilføj trigger til push_subscriptions
DROP TRIGGER IF EXISTS update_push_subscriptions_updated_at ON push_subscriptions;
CREATE TRIGGER update_push_subscriptions_updated_at
  BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. Verificer at alt er oprettet korrekt
-- ============================================================================

-- Vis tabel struktur
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'push_subscriptions'
ORDER BY ordinal_position;

-- Vis policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'push_subscriptions';

-- Tjek om members har push_notifications_enabled
SELECT
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'members'
  AND column_name = 'push_notifications_enabled';

-- ============================================================================
-- DONE! Nu er push notifications sat op 🎉
-- ============================================================================
