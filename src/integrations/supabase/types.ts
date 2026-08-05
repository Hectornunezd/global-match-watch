export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      affiliate_clicks: {
        Row: {
          affiliate_partner: string | null
          channel_name: string | null
          clicked_at: string
          country_code: string | null
          fixture_id: string | null
          id: string
          page_type: string | null
        }
        Insert: {
          affiliate_partner?: string | null
          channel_name?: string | null
          clicked_at?: string
          country_code?: string | null
          fixture_id?: string | null
          id?: string
          page_type?: string | null
        }
        Update: {
          affiliate_partner?: string | null
          channel_name?: string | null
          clicked_at?: string
          country_code?: string | null
          fixture_id?: string | null
          id?: string
          page_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_fixture_id_fkey"
            columns: ["fixture_id"]
            isOneToOne: false
            referencedRelation: "fixtures"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          affiliate_partner: string | null
          affiliate_url: string | null
          channel_name: string
          channel_type: string
          channel_url: string | null
          country_code: string
          created_at: string
          id: string
          is_free: boolean
          logo_url: string | null
          sort_order: number
        }
        Insert: {
          affiliate_partner?: string | null
          affiliate_url?: string | null
          channel_name: string
          channel_type: string
          channel_url?: string | null
          country_code: string
          created_at?: string
          id?: string
          is_free?: boolean
          logo_url?: string | null
          sort_order?: number
        }
        Update: {
          affiliate_partner?: string | null
          affiliate_url?: string | null
          channel_name?: string
          channel_type?: string
          channel_url?: string | null
          country_code?: string
          created_at?: string
          id?: string
          is_free?: boolean
          logo_url?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "channels_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
      countries: {
        Row: {
          code: string
          created_at: string
          flag_emoji: string | null
          language_default: string
          meta_description_en: string | null
          meta_description_es: string | null
          meta_title_en: string | null
          meta_title_es: string | null
          name_en: string
          name_es: string
          slug_en: string
          slug_es: string
        }
        Insert: {
          code: string
          created_at?: string
          flag_emoji?: string | null
          language_default?: string
          meta_description_en?: string | null
          meta_description_es?: string | null
          meta_title_en?: string | null
          meta_title_es?: string | null
          name_en: string
          name_es: string
          slug_en: string
          slug_es: string
        }
        Update: {
          code?: string
          created_at?: string
          flag_emoji?: string | null
          language_default?: string
          meta_description_en?: string | null
          meta_description_es?: string | null
          meta_title_en?: string | null
          meta_title_es?: string | null
          name_en?: string
          name_es?: string
          slug_en?: string
          slug_es?: string
        }
        Relationships: []
      }
      fixtures: {
        Row: {
          api_football_id: number | null
          away_score: number | null
          away_team_id: string
          city: string | null
          competition: string
          created_at: string
          home_score: number | null
          home_team_id: string
          id: string
          match_date: string
          matchday: number | null
          meta_description_en: string | null
          meta_description_es: string | null
          meta_title_en: string | null
          meta_title_es: string | null
          round: string | null
          slug_en: string
          slug_es: string
          stage: string
          status: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          api_football_id?: number | null
          away_score?: number | null
          away_team_id: string
          city?: string | null
          competition?: string
          created_at?: string
          home_score?: number | null
          home_team_id: string
          id?: string
          match_date: string
          matchday?: number | null
          meta_description_en?: string | null
          meta_description_es?: string | null
          meta_title_en?: string | null
          meta_title_es?: string | null
          round?: string | null
          slug_en: string
          slug_es: string
          stage?: string
          status?: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          api_football_id?: number | null
          away_score?: number | null
          away_team_id?: string
          city?: string | null
          competition?: string
          created_at?: string
          home_score?: number | null
          home_team_id?: string
          id?: string
          match_date?: string
          matchday?: number | null
          meta_description_en?: string | null
          meta_description_es?: string | null
          meta_title_en?: string | null
          meta_title_es?: string | null
          round?: string | null
          slug_en?: string
          slug_es?: string
          stage?: string
          status?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fixtures_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixtures_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          api_football_id: number | null
          country_code: string
          created_at: string
          flag_url: string | null
          group_letter: string | null
          id: string
          name_en: string
          name_es: string
          short_code: string | null
          slug_en: string
          slug_es: string
          stadium: string | null
        }
        Insert: {
          api_football_id?: number | null
          country_code: string
          created_at?: string
          flag_url?: string | null
          group_letter?: string | null
          id?: string
          name_en: string
          name_es: string
          short_code?: string | null
          slug_en: string
          slug_es: string
          stadium?: string | null
        }
        Update: {
          api_football_id?: number | null
          country_code?: string
          created_at?: string
          flag_url?: string | null
          group_letter?: string | null
          id?: string
          name_en?: string
          name_es?: string
          short_code?: string | null
          slug_en?: string
          slug_es?: string
          stadium?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
