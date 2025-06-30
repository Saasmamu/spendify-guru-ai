
-- Fix the budget_categories table to ensure ID is properly generated
ALTER TABLE public.budget_categories ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Update any existing records that might have null IDs
UPDATE public.budget_categories SET id = gen_random_uuid() WHERE id IS NULL;
