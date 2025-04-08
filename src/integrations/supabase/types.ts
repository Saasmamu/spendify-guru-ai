export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      financial_goals: {
        Row: {
          ai_suggestions: string[] | null
          category: string | null
          created_at: string | null
          current_amount: number | null
          description: string | null
          goal_type: Database["public"]["Enums"]["goal_type"]
          id: string
          last_notification_date: string | null
          notifications_enabled: boolean | null
          start_date: string | null
          status: Database["public"]["Enums"]["goal_status"] | null
          target_amount: number
          target_date: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_suggestions?: string[] | null
          category?: string | null
          created_at?: string | null
          current_amount?: number | null
          description?: string | null
          goal_type?: Database["public"]["Enums"]["goal_type"]
          id?: string
          last_notification_date?: string | null
          notifications_enabled?: boolean | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["goal_status"] | null
          target_amount: number
          target_date: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_suggestions?: string[] | null
          category?: string | null
          created_at?: string | null
          current_amount?: number | null
          description?: string | null
          goal_type?: Database["public"]["Enums"]["goal_type"]
          id?: string
          last_notification_date?: string | null
          notifications_enabled?: boolean | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["goal_status"] | null
          target_amount?: number
          target_date?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
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
      subscriptions: {
        Row: {
          created_at: string | null
          id: string
          plan: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          plan: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          plan?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
    }
    Views: {
      goal_progress_stats: {
        Row: {
          active_goals: number | null
          average_progress: number | null
          completed_goals: number | null
          off_track_goals: number | null
          total_goals: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
