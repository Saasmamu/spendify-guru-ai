export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      analytics_cohorts: {
        Row: {
          average_revenue: number | null
          cohort_date: string
          cohort_size: number
          conversion_rate: number | null
          created_at: string | null
          id: string
          retention_180d: number | null
          retention_30d: number | null
          retention_60d: number | null
          retention_90d: number | null
          updated_at: string | null
        }
        Insert: {
          average_revenue?: number | null
          cohort_date: string
          cohort_size: number
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          retention_180d?: number | null
          retention_30d?: number | null
          retention_60d?: number | null
          retention_90d?: number | null
          updated_at?: string | null
        }
        Update: {
          average_revenue?: number | null
          cohort_date?: string
          cohort_size?: number
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          retention_180d?: number | null
          retention_30d?: number | null
          retention_60d?: number | null
          retention_90d?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics_daily_metrics: {
        Row: {
          active_users: number | null
          average_processing_time: number | null
          cancellations: number | null
          churn_rate: number | null
          created_at: string | null
          date: string
          documents_processed: number | null
          id: string
          new_users: number | null
          plan_downgrades: number | null
          plan_upgrades: number | null
          retention_rate: number | null
          total_revenue: number | null
          trial_conversion_rate: number | null
          trial_conversions: number | null
          updated_at: string | null
        }
        Insert: {
          active_users?: number | null
          average_processing_time?: number | null
          cancellations?: number | null
          churn_rate?: number | null
          created_at?: string | null
          date: string
          documents_processed?: number | null
          id?: string
          new_users?: number | null
          plan_downgrades?: number | null
          plan_upgrades?: number | null
          retention_rate?: number | null
          total_revenue?: number | null
          trial_conversion_rate?: number | null
          trial_conversions?: number | null
          updated_at?: string | null
        }
        Update: {
          active_users?: number | null
          average_processing_time?: number | null
          cancellations?: number | null
          churn_rate?: number | null
          created_at?: string | null
          date?: string
          documents_processed?: number | null
          id?: string
          new_users?: number | null
          plan_downgrades?: number | null
          plan_upgrades?: number | null
          retention_rate?: number | null
          total_revenue?: number | null
          trial_conversion_rate?: number | null
          trial_conversions?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics_document_metrics: {
        Row: {
          average_processing_time_ms: number | null
          average_size_kb: number | null
          count: number | null
          created_at: string | null
          date: string
          document_type: string
          id: string
          success_rate: number | null
          updated_at: string | null
        }
        Insert: {
          average_processing_time_ms?: number | null
          average_size_kb?: number | null
          count?: number | null
          created_at?: string | null
          date: string
          document_type: string
          id?: string
          success_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          average_processing_time_ms?: number | null
          average_size_kb?: number | null
          count?: number | null
          created_at?: string | null
          date?: string
          document_type?: string
          id?: string
          success_rate?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics_plan_revenue: {
        Row: {
          created_at: string | null
          date: string
          id: string
          plan_id: string
          plan_name: string
          revenue: number | null
          subscriber_count: number | null
          trial_count: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          plan_id: string
          plan_name: string
          revenue?: number | null
          subscriber_count?: number | null
          trial_count?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          plan_id?: string
          plan_name?: string
          revenue?: number | null
          subscriber_count?: number | null
          trial_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      budget_alerts: {
        Row: {
          budget_category_id: string
          created_at: string | null
          id: string
          is_triggered: boolean | null
          threshold_percentage: number
        }
        Insert: {
          budget_category_id: string
          created_at?: string | null
          id?: string
          is_triggered?: boolean | null
          threshold_percentage: number
        }
        Update: {
          budget_category_id?: string
          created_at?: string | null
          id?: string
          is_triggered?: boolean | null
          threshold_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "budget_alerts_budget_category_id_fkey"
            columns: ["budget_category_id"]
            isOneToOne: false
            referencedRelation: "budget_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_categories: {
        Row: {
          allocated_amount: number
          budget_id: string
          category: string
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          allocated_amount: number
          budget_id: string
          category: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          allocated_amount?: number
          budget_id?: string
          category?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_categories_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          amount: number
          created_at: string | null
          end_date: string | null
          id: string
          name: string
          period: string
          start_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          end_date?: string | null
          id?: string
          name: string
          period: string
          start_date: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          end_date?: string | null
          id?: string
          name?: string
          period?: string
          start_date?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      document_analysis: {
        Row: {
          analysis_data: Json
          analysis_type: string
          created_at: string | null
          document_id: string
          id: string
          updated_at: string | null
        }
        Insert: {
          analysis_data: Json
          analysis_type: string
          created_at?: string | null
          document_id: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          analysis_data?: Json
          analysis_type?: string
          created_at?: string | null
          document_id?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_analysis_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          processed_data: Json | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size: number
          file_type: string
          id?: string
          processed_data?: Json | null
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          processed_data?: Json | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          category_id: string | null
          created_at: string | null
          date: string
          description: string
          id: string
          is_recurring: boolean | null
          receipt: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          category_id?: string | null
          created_at?: string | null
          date: string
          description: string
          id?: string
          is_recurring?: boolean | null
          receipt?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          category_id?: string | null
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          is_recurring?: boolean | null
          receipt?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_goals: {
        Row: {
          category: string | null
          category_id: string | null
          created_at: string
          current_amount: number | null
          deadline: string | null
          id: string
          last_updated_by: string | null
          milestone_amounts: number[] | null
          milestone_dates: string[] | null
          name: string
          notes: string | null
          progress_percentage: number | null
          status: string | null
          target_amount: number
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          category_id?: string | null
          created_at?: string
          current_amount?: number | null
          deadline?: string | null
          id?: string
          last_updated_by?: string | null
          milestone_amounts?: number[] | null
          milestone_dates?: string[] | null
          name: string
          notes?: string | null
          progress_percentage?: number | null
          status?: string | null
          target_amount: number
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          category_id?: string | null
          created_at?: string
          current_amount?: number | null
          deadline?: string | null
          id?: string
          last_updated_by?: string | null
          milestone_amounts?: number[] | null
          milestone_dates?: string[] | null
          name?: string
          notes?: string | null
          progress_percentage?: number | null
          status?: string | null
          target_amount?: number
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_goals_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "goal_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_predictions: {
        Row: {
          amount: number
          category_id: string | null
          confidence_score: number | null
          date: string
          description: string | null
          factors: string[] | null
          id: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          confidence_score?: number | null
          date: string
          description?: string | null
          factors?: string[] | null
          id?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          confidence_score?: number | null
          date?: string
          description?: string | null
          factors?: string[] | null
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_predictions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      goal_milestones: {
        Row: {
          achieved_date: string | null
          amount: number
          created_at: string
          description: string | null
          goal_id: string | null
          id: string
          target_date: string | null
        }
        Insert: {
          achieved_date?: string | null
          amount: number
          created_at?: string
          description?: string | null
          goal_id?: string | null
          id?: string
          target_date?: string | null
        }
        Update: {
          achieved_date?: string | null
          amount?: number
          created_at?: string
          description?: string | null
          goal_id?: string | null
          id?: string
          target_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goal_milestones_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "financial_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_progress_history: {
        Row: {
          amount: number
          goal_id: string | null
          id: string
          notes: string | null
          recorded_at: string
          recorded_by: string | null
        }
        Insert: {
          amount: number
          goal_id?: string | null
          id?: string
          notes?: string | null
          recorded_at?: string
          recorded_by?: string | null
        }
        Update: {
          amount?: number
          goal_id?: string | null
          id?: string
          notes?: string | null
          recorded_at?: string
          recorded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goal_progress_history_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "financial_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_templates: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          suggested_deadline_months: number | null
          target_amount_range_max: number | null
          target_amount_range_min: number | null
          tips: string[] | null
          type: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          suggested_deadline_months?: number | null
          target_amount_range_max?: number | null
          target_amount_range_min?: number | null
          tips?: string[] | null
          type: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          suggested_deadline_months?: number | null
          target_amount_range_max?: number | null
          target_amount_range_min?: number | null
          tips?: string[] | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "goal_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      incomes: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string | null
          date: string
          description: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string | null
          date: string
          description: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "incomes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          access_token: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          provider: string
          refresh_token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          provider: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          provider?: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      money_tips: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          tip: string
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          tip: string
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          tip?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      recurring_transactions: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string | null
          description: string
          end_date: string | null
          frequency: string
          id: string
          is_active: boolean | null
          next_occurrence: string
          start_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string | null
          description: string
          end_date?: string | null
          frequency: string
          id?: string
          is_active?: boolean | null
          next_occurrence: string
          start_date: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string | null
          description?: string
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          next_occurrence?: string
          start_date?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recurring_transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          file_url: string | null
          filters: Json | null
          generated_at: string | null
          id: string
          type: string
          user_id: string
        }
        Insert: {
          file_url?: string | null
          filters?: Json | null
          generated_at?: string | null
          id?: string
          type: string
          user_id: string
        }
        Update: {
          file_url?: string | null
          filters?: Json | null
          generated_at?: string | null
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_analyses: {
        Row: {
          categories: Json
          created_at: string
          date: string
          id: string
          insights: Json
          name: string
          total_expense: number
          total_income: number
          transactions: Json
          user_id: string
        }
        Insert: {
          categories: Json
          created_at?: string
          date?: string
          id: string
          insights: Json
          name: string
          total_expense: number
          total_income: number
          transactions: Json
          user_id: string
        }
        Update: {
          categories?: Json
          created_at?: string
          date?: string
          id?: string
          insights?: Json
          name?: string
          total_expense?: number
          total_income?: number
          transactions?: Json
          user_id?: string
        }
        Relationships: []
      }
      spending_patterns: {
        Row: {
          amount: number
          confidence_score: number | null
          description: string | null
          first_occurrence: string | null
          frequency: string | null
          id: string
          last_occurrence: string | null
          name: string
          transactions: string[] | null
          type: string | null
          user_id: string
        }
        Insert: {
          amount: number
          confidence_score?: number | null
          description?: string | null
          first_occurrence?: string | null
          frequency?: string | null
          id?: string
          last_occurrence?: string | null
          name: string
          transactions?: string[] | null
          type?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          confidence_score?: number | null
          description?: string | null
          first_occurrence?: string | null
          frequency?: string | null
          id?: string
          last_occurrence?: string | null
          name?: string
          transactions?: string[] | null
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          id: string
          interval: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          interval: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          interval?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          card_added: boolean | null
          created_at: string | null
          current_period_end: string | null
          id: string
          plan: string | null
          plan_id: string | null
          status: string
          trial_ends_at: string | null
          trial_type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          card_added?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          plan?: string | null
          plan_id?: string | null
          status?: string
          trial_ends_at?: string | null
          trial_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          card_added?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          plan?: string | null
          plan_id?: string | null
          status?: string
          trial_ends_at?: string | null
          trial_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_anomalies: {
        Row: {
          description: string | null
          detected_at: string
          id: string
          severity: string | null
          status: string | null
          transaction_id: string
          type: string
          user_id: string
        }
        Insert: {
          description?: string | null
          detected_at?: string
          id?: string
          severity?: string | null
          status?: string | null
          transaction_id: string
          type: string
          user_id: string
        }
        Update: {
          description?: string | null
          detected_at?: string
          id?: string
          severity?: string | null
          status?: string | null
          transaction_id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_anomalies_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          balance: number | null
          category: string
          channel: string | null
          created_at: string
          date: string
          description: string
          id: string
          reference: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          balance?: number | null
          category: string
          channel?: string | null
          created_at?: string
          date: string
          description: string
          id?: string
          reference?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          balance?: number | null
          category?: string
          channel?: string | null
          created_at?: string
          date?: string
          description?: string
          id?: string
          reference?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          notification_settings: Json | null
          ui_preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notification_settings?: Json | null
          ui_preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notification_settings?: Json | null
          ui_preferences?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          notification_preferences: Json | null
          privacy_settings: Json | null
          profile: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          notification_preferences?: Json | null
          privacy_settings?: Json | null
          profile?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          notification_preferences?: Json | null
          privacy_settings?: Json | null
          profile?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_financial_goal: {
        Args: {
          p_name: string
          p_target_amount: number
          p_current_amount?: number
          p_deadline?: string
          p_type?: string
          p_category_id?: string
          p_notes?: string
          p_user_id?: string
        }
        Returns: {
          category: string | null
          category_id: string | null
          created_at: string
          current_amount: number | null
          deadline: string | null
          id: string
          last_updated_by: string | null
          milestone_amounts: number[] | null
          milestone_dates: string[] | null
          name: string
          notes: string | null
          progress_percentage: number | null
          status: string | null
          target_amount: number
          type: string
          updated_at: string
          user_id: string
        }
      }
      get_goal_suggestions: {
        Args: { p_user_id: string; p_income?: number; p_expenses?: number }
        Returns: {
          template_id: string
          name: string
          description: string
          suggested_amount: number
          suggested_deadline: string
          category_id: string
          type: string
          tips: string[]
        }[]
      }
      update_goal_progress: {
        Args: { p_goal_id: string; p_amount: number; p_notes?: string }
        Returns: {
          category: string | null
          category_id: string | null
          created_at: string
          current_amount: number | null
          deadline: string | null
          id: string
          last_updated_by: string | null
          milestone_amounts: number[] | null
          milestone_dates: string[] | null
          name: string
          notes: string | null
          progress_percentage: number | null
          status: string | null
          target_amount: number
          type: string
          updated_at: string
          user_id: string
        }
      }
    }
    Enums: {
      goal_status: "in_progress" | "completed" | "off_track" | "failed"
      goal_type: "savings" | "budget" | "debt_payment" | "custom"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      goal_status: ["in_progress", "completed", "off_track", "failed"],
      goal_type: ["savings", "budget", "debt_payment", "custom"],
    },
  },
} as const
