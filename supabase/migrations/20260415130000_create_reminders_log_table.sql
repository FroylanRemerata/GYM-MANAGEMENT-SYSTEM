-- Create reminders_log table to track reminder history
CREATE TABLE IF NOT EXISTS public.reminders_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('renewal', 'inactive', 'promotion')),
  sent_at TIMESTAMP NOT NULL DEFAULT NOW(),
  read_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reminders_log_member_id ON public.reminders_log(member_id);
CREATE INDEX IF NOT EXISTS idx_reminders_log_reminder_type ON public.reminders_log(reminder_type);
CREATE INDEX IF NOT EXISTS idx_reminders_log_sent_at ON public.reminders_log(sent_at DESC);

-- Enable Row Level Security
ALTER TABLE public.reminders_log ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own reminder logs" ON public.reminders_log
  FOR SELECT USING (auth.uid() = member_id OR (SELECT role FROM auth.users WHERE id = auth.uid()) IN ('admin', 'super_admin'));

CREATE POLICY "Only admins can insert reminder logs" ON public.reminders_log
  FOR INSERT WITH CHECK ((SELECT role FROM auth.users WHERE id = auth.uid()) IN ('admin', 'super_admin'));

CREATE POLICY "Only admins can update reminder logs" ON public.reminders_log
  FOR UPDATE USING ((SELECT role FROM auth.users WHERE id = auth.uid()) IN ('admin', 'super_admin'));

-- Create automatic updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reminders_log_updated_at BEFORE UPDATE ON public.reminders_log
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
