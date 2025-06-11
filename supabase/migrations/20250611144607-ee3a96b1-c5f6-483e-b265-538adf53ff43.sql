
-- Create a table for saved analyses with RLS policies
CREATE TABLE IF NOT EXISTS public.saved_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  transactions JSONB NOT NULL,
  total_income NUMERIC NOT NULL,
  total_expense NUMERIC NOT NULL,
  categories JSONB NOT NULL,
  insights JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies for saved analyses
CREATE POLICY "Users can view their own saved analyses" 
  ON public.saved_analyses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved analyses" 
  ON public.saved_analyses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved analyses" 
  ON public.saved_analyses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved analyses" 
  ON public.saved_analyses 
  FOR DELETE 
  USING (auth.uid() = user_id);
