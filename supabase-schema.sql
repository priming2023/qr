-- Supabase Database Schema for Treasure Hunt App

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id VARCHAR(255) UNIQUE NOT NULL,
  found_codes TEXT[] DEFAULT '{}',
  total_coins INTEGER DEFAULT 0,
  last_prize_redemption TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prize_redemptions table
CREATE TABLE IF NOT EXISTS prize_redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id VARCHAR(255) NOT NULL,
  found_count INTEGER NOT NULL,
  redemption_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_device_id ON user_progress(device_id);
CREATE INDEX IF NOT EXISTS idx_prize_redemptions_device_id ON prize_redemptions(device_id);
CREATE INDEX IF NOT EXISTS idx_prize_redemptions_date ON prize_redemptions(redemption_date);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_progress_updated_at 
    BEFORE UPDATE ON user_progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE prize_redemptions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read their own progress
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (device_id = current_setting('app.current_device_id', true));

-- Allow anonymous users to insert their own progress
CREATE POLICY "Users can insert own progress" ON user_progress
    FOR INSERT WITH CHECK (device_id = current_setting('app.current_device_id', true));

-- Allow anonymous users to update their own progress
CREATE POLICY "Users can update own progress" ON user_progress
    FOR UPDATE USING (device_id = current_setting('app.current_device_id', true));

-- Allow anonymous users to view their own prize redemptions
CREATE POLICY "Users can view own prize redemptions" ON prize_redemptions
    FOR SELECT USING (device_id = current_setting('app.current_device_id', true));

-- Allow anonymous users to insert their own prize redemptions
CREATE POLICY "Users can insert own prize redemptions" ON prize_redemptions
    FOR INSERT WITH CHECK (device_id = current_setting('app.current_device_id', true));
