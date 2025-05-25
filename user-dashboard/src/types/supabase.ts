export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      ai_interactions: {
        Row: {
          ai_provider: string | null;
          ai_response: string | null;
          created_at: string | null;
          id: string;
          project_id: string | null;
          user_id: string | null;
          user_query: string;
        };
        Insert: {
          ai_provider?: string | null;
          ai_response?: string | null;
          created_at?: string | null;
          id?: string;
          project_id?: string | null;
          user_id?: string | null;
          user_query: string;
        };
        Update: {
          ai_provider?: string | null;
          ai_response?: string | null;
          created_at?: string | null;
          id?: string;
          project_id?: string | null;
          user_id?: string | null;
          user_query?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_interactions_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      project_files: {
        Row: {
          created_at: string | null;
          file_size: number | null;
          file_type: string | null;
          id: string;
          name: string;
          project_id: string | null;
          storage_path: string | null;
          updated_at: string | null;
          uploaded_by: string | null;
        };
        Insert: {
          created_at?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          id?: string;
          name: string;
          project_id?: string | null;
          storage_path?: string | null;
          updated_at?: string | null;
          uploaded_by?: string | null;
        };
        Update: {
          created_at?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          id?: string;
          name?: string;
          project_id?: string | null;
          storage_path?: string | null;
          updated_at?: string | null;
          uploaded_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      project_phases: {
        Row: {
          created_at: string | null;
          description: string | null;
          end_date: string | null;
          id: string;
          name: string;
          position: number | null;
          progress: number | null;
          project_id: string | null;
          responsible_name: string | null;
          start_date: string | null;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          name: string;
          position?: number | null;
          progress?: number | null;
          project_id?: string | null;
          responsible_name?: string | null;
          start_date?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          name?: string;
          position?: number | null;
          progress?: number | null;
          project_id?: string | null;
          responsible_name?: string | null;
          start_date?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "project_phases_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      project_updates: {
        Row: {
          admin_user_id: string | null;
          created_at: string | null;
          created_by_admin: boolean | null;
          id: string;
          project_id: string | null;
          update_text: string;
        };
        Insert: {
          admin_user_id?: string | null;
          created_at?: string | null;
          created_by_admin?: boolean | null;
          id?: string;
          project_id?: string | null;
          update_text: string;
        };
        Update: {
          admin_user_id?: string | null;
          created_at?: string | null;
          created_by_admin?: boolean | null;
          id?: string;
          project_id?: string | null;
          update_text?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_updates_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      projects: {
        Row: {
          created_at: string | null;
          description: string | null;
          end_date: string | null;
          id: string;
          name: string;
          start_date: string | null;
          status: string | null;
          type: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          name: string;
          start_date?: string | null;
          status?: string | null;
          type?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          name?: string;
          start_date?: string | null;
          status?: string | null;
          type?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          company_name: string | null;
          created_at: string | null;
          full_name: string | null;
          id: string;
          is_admin: boolean | null;
          updated_at: string | null;
          project_objective: string | null;
          industry: string | null;
          expected_timeline: string | null;
          email: string | null;
        };
        Insert: {
          company_name?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id: string;
          is_admin?: boolean | null;
          updated_at?: string | null;
          project_objective?: string | null;
          industry?: string | null;
          expected_timeline?: string | null;
          email?: string | null;
        };
        Update: {
          company_name?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id?: string;
          is_admin?: boolean | null;
          updated_at?: string | null;
          project_objective?: string | null;
          industry?: string | null;
          expected_timeline?: string | null;
          email?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_ai_completion: {
        Args: {
          prompt_input: string;
          max_tokens_input?: number;
          temperature_input?: number;
        };
        Returns: string;
      };
      is_current_user_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      search_users_with_ai: {
        Args: { search_query: string };
        Returns: string[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
  ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
  ? R
  : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
  ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I;
  }
  ? I
  : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
  ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U;
  }
  ? U
  : never
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
