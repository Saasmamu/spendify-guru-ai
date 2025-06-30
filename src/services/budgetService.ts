
import { supabase } from '@/lib/supabase';

export interface Budget {
  id: string;
  name: string;
  amount: number;
  period: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface BudgetCategory {
  id: string;
  budget_id: string;
  category: string;
  allocated_amount: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetAlert {
  id: string;
  budget_category_id: string;
  threshold_percentage: number;
  is_triggered: boolean;
  created_at: string;
}

export interface BudgetWithCategories extends Budget {
  categories: (BudgetCategory & {
    spent_amount: number;
    percentage: number;
  })[];
}

class BudgetService {
  async getBudgets(userId: string): Promise<BudgetWithCategories[]> {
    try {
      console.log('Fetching budgets for user:', userId);

      // Get user's budgets
      const { data: budgetsData, error: budgetsError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (budgetsError) {
        console.error('Error fetching budgets:', budgetsError);
        throw budgetsError;
      }

      console.log('Budgets data:', budgetsData);
      
      // For each budget, get its categories
      const budgetsWithCategories = await Promise.all(
        budgetsData.map(async (budget) => {
          console.log('Processing budget:', budget.id);

          const { data: categoriesData, error: categoriesError } = await supabase
            .from('budget_categories')
            .select('*')
            .eq('budget_id', budget.id);
          
          if (categoriesError) {
            console.error('Error fetching budget categories:', categoriesError);
            throw categoriesError;
          }

          console.log('Categories for budget', budget.id, ':', categoriesData);
          
          // Calculate spent amount for each category
          const categoriesWithSpending = await Promise.all(
            categoriesData.map(async (category) => {
              console.log('Processing category:', category.category);

              // Get expenses for this category within budget period
              const { data: expenses, error: expensesError } = await supabase
                .from('expenses')
                .select('amount')
                .eq('category', category.category)
                .eq('user_id', userId)
                .gte('date', budget.start_date)
                .lte('date', budget.end_date || new Date().toISOString().split('T')[0]);
              
              if (expensesError) {
                console.error('Error fetching expenses:', expensesError);
                // Don't throw here, just log and continue with 0 spent
                console.log('Using 0 for spent amount due to error');
              }

              const spent_amount = expenses ? expenses.reduce((sum, exp) => sum + Number(exp.amount), 0) : 0;
              const percentage = category.allocated_amount > 0 ? (spent_amount / category.allocated_amount) * 100 : 0;
              
              console.log('Category spending:', {
                category: category.category,
                allocated: category.allocated_amount,
                spent: spent_amount,
                percentage
              });

              return {
                ...category,
                spent_amount,
                percentage
              };
            })
          );
          
          return {
            ...budget,
            categories: categoriesWithSpending
          };
        })
      );
      
      console.log('Final budgets with categories:', budgetsWithCategories);
      return budgetsWithCategories;
    } catch (error) {
      console.error('Error in getBudgets:', error);
      throw error;
    }
  }

  async getBudget(budgetId: string): Promise<BudgetWithCategories> {
    try {
      console.log('Fetching budget:', budgetId);

      // Fetch budget details
      const { data: budget, error: budgetError } = await supabase
        .from('budgets')
        .select('*')
        .eq('id', budgetId)
        .single();
      
      if (budgetError) {
        console.error('Error fetching budget:', budgetError);
        throw budgetError;
      }

      console.log('Budget data:', budget);
      
      // Fetch budget categories
      const { data: categories, error: categoriesError } = await supabase
        .from('budget_categories')
        .select('*')
        .eq('budget_id', budgetId);
      
      if (categoriesError) {
        console.error('Error fetching budget categories:', categoriesError);
        throw categoriesError;
      }

      console.log('Categories data:', categories);
      
      // Calculate spent amount for each category
      const categoriesWithSpending = await Promise.all(
        categories.map(async (category) => {
          // Get expenses for this category within budget period
          const { data: expenses, error: expensesError } = await supabase
            .from('expenses')
            .select('amount')
            .eq('category', category.category)
            .gte('date', budget.start_date)
            .lte('date', budget.end_date || new Date().toISOString().split('T')[0]);
          
          if (expensesError) {
            console.error('Error fetching expenses for category:', expensesError);
            // Don't throw, just use 0
          }

          const spent_amount = expenses ? expenses.reduce((sum, exp) => sum + Number(exp.amount), 0) : 0;
          const percentage = category.allocated_amount > 0 ? (spent_amount / category.allocated_amount) * 100 : 0;
          
          return {
            ...category,
            spent_amount,
            percentage
          };
        })
      );
      
      return {
        ...budget,
        categories: categoriesWithSpending
      };
    } catch (error) {
      console.error('Error fetching budget:', error);
      throw error;
    }
  }

  async createBudget(
    userId: string,
    budgetData: {
      name: string;
      amount: number;
      period: string;
      start_date: string;
      end_date?: string | null;
      categories: { category: string; allocated_amount: number }[];
    }
  ): Promise<string> {
    try {
      console.log('Creating budget:', budgetData);

      // Create new budget
      const { data: newBudget, error: budgetError } = await supabase
        .from('budgets')
        .insert({
          user_id: userId,
          name: budgetData.name,
          amount: budgetData.amount,
          period: budgetData.period,
          start_date: budgetData.start_date,
          end_date: budgetData.end_date || null
        })
        .select()
        .single();
      
      if (budgetError) {
        console.error('Error creating budget:', budgetError);
        throw budgetError;
      }

      console.log('Budget created:', newBudget);
      
      // Insert categories - ID will be auto-generated now
      const categoriesData = budgetData.categories.map(cat => ({
        budget_id: newBudget.id,
        category: cat.category,
        allocated_amount: cat.allocated_amount
      }));

      console.log('Creating categories:', categoriesData);

      const { data: createdCategories, error: categoriesError } = await supabase
        .from('budget_categories')
        .insert(categoriesData)
        .select();
      
      if (categoriesError) {
        console.error('Error creating budget categories:', categoriesError);
        throw categoriesError;
      }

      console.log('Categories created:', createdCategories);
      
      return newBudget.id;
    } catch (error) {
      console.error('Error in createBudget:', error);
      throw error;
    }
  }

  async updateBudget(
    budgetId: string,
    budgetData: {
      name: string;
      amount: number;
      period: string;
      start_date: string;
      end_date?: string | null;
      categories: { id?: string; category: string; allocated_amount: number }[];
    }
  ): Promise<void> {
    try {
      console.log('Updating budget:', budgetId, budgetData);

      // Update budget
      const { error: budgetError } = await supabase
        .from('budgets')
        .update({
          name: budgetData.name,
          amount: budgetData.amount,
          period: budgetData.period,
          start_date: budgetData.start_date,
          end_date: budgetData.end_date || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', budgetId);
      
      if (budgetError) {
        console.error('Error updating budget:', budgetError);
        throw budgetError;
      }
      
      // Delete existing categories
      const { error: deleteError } = await supabase
        .from('budget_categories')
        .delete()
        .eq('budget_id', budgetId);
      
      if (deleteError) {
        console.error('Error deleting old categories:', deleteError);
        throw deleteError;
      }
      
      // Insert updated categories - ID will be auto-generated
      const categoriesData = budgetData.categories.map(cat => ({
        budget_id: budgetId,
        category: cat.category,
        allocated_amount: cat.allocated_amount
      }));

      const { error: categoriesError } = await supabase
        .from('budget_categories')
        .insert(categoriesData);
      
      if (categoriesError) {
        console.error('Error creating updated categories:', categoriesError);
        throw categoriesError;
      }

      console.log('Budget updated successfully');
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  }

  async deleteBudget(budgetId: string): Promise<void> {
    try {
      // Delete budget (categories will be deleted via cascade)
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budgetId);
      
      if (error) {
        console.error('Error deleting budget:', error);
        throw error;
      }

      console.log('Budget deleted successfully');
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  }

  async checkBudgetAlerts(userId: string): Promise<{
    categoryId: string;
    budgetId: string;
    budgetName: string;
    categoryName: string;
    percentage: number;
    threshold: number;
  }[]> {
    try {
      // Get all active budgets
      const budgets = await this.getBudgets(userId);
      
      // Find categories that are approaching or exceeding their thresholds
      const alerts = [];
      
      for (const budget of budgets) {
        for (const category of budget.categories) {
          // Check if spending is over 80% of allocation
          if (category.percentage >= 80) {
            alerts.push({
              categoryId: category.id,
              budgetId: budget.id,
              budgetName: budget.name,
              categoryName: category.category,
              percentage: category.percentage,
              threshold: 80
            });
          }
        }
      }
      
      return alerts;
    } catch (error) {
      console.error('Error checking budget alerts:', error);
      throw error;
    }
  }
}

export const budgetService = new BudgetService();
