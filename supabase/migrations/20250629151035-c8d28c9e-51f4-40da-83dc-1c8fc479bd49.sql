
-- Add the missing category column to the expenses table
ALTER TABLE public.expenses ADD COLUMN category VARCHAR(100);

-- Update existing records to use category names from the categories table
UPDATE public.expenses 
SET category = c.name 
FROM public.categories c 
WHERE public.expenses.category_id = c.id;

-- Make the category column NOT NULL after updating existing records
ALTER TABLE public.expenses ALTER COLUMN category SET NOT NULL;

-- Add the missing receipt column that the ExpenseForm expects
ALTER TABLE public.expenses ADD COLUMN receipt TEXT;
