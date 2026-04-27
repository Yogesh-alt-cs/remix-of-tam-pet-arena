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
      arena_battle_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          match_id: string
          payload: Json
          turn_number: number
          wallet_address: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          match_id: string
          payload?: Json
          turn_number: number
          wallet_address: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          match_id?: string
          payload?: Json
          turn_number?: number
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "arena_battle_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "arena_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      arena_chat_messages: {
        Row: {
          created_at: string
          emoji: string | null
          id: string
          match_id: string
          message: string | null
          player_name: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          emoji?: string | null
          id?: string
          match_id: string
          message?: string | null
          player_name: string
          wallet_address: string
        }
        Update: {
          created_at?: string
          emoji?: string | null
          id?: string
          match_id?: string
          message?: string | null
          player_name?: string
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "arena_chat_messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "arena_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      arena_match_players: {
        Row: {
          connected_at: string | null
          created_at: string
          current_energy: number
          current_hp: number
          id: string
          locked_at: string
          match_id: string
          pet_snapshot: Json
          player_name: string
          rating_after: number | null
          rating_before: number
          selected_pet_id: string
          selected_species_id: string
          side: string
          wallet_address: string
        }
        Insert: {
          connected_at?: string | null
          created_at?: string
          current_energy?: number
          current_hp?: number
          id?: string
          locked_at?: string
          match_id: string
          pet_snapshot?: Json
          player_name: string
          rating_after?: number | null
          rating_before?: number
          selected_pet_id: string
          selected_species_id: string
          side: string
          wallet_address: string
        }
        Update: {
          connected_at?: string | null
          created_at?: string
          current_energy?: number
          current_hp?: number
          id?: string
          locked_at?: string
          match_id?: string
          pet_snapshot?: Json
          player_name?: string
          rating_after?: number | null
          rating_before?: number
          selected_pet_id?: string
          selected_species_id?: string
          side?: string
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "arena_match_players_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "arena_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      arena_matches: {
        Row: {
          active_wallet_address: string | null
          completed_at: string | null
          created_at: string
          id: string
          mode: string
          replay: Json
          room_code: string | null
          seed: string
          started_at: string | null
          status: string
          token_awarded: number
          turn_deadline_at: string | null
          turn_number: number
          updated_at: string
          winner_wallet_address: string | null
          xp_awarded: number
        }
        Insert: {
          active_wallet_address?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          mode: string
          replay?: Json
          room_code?: string | null
          seed: string
          started_at?: string | null
          status?: string
          token_awarded?: number
          turn_deadline_at?: string | null
          turn_number?: number
          updated_at?: string
          winner_wallet_address?: string | null
          xp_awarded?: number
        }
        Update: {
          active_wallet_address?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          mode?: string
          replay?: Json
          room_code?: string | null
          seed?: string
          started_at?: string | null
          status?: string
          token_awarded?: number
          turn_deadline_at?: string | null
          turn_number?: number
          updated_at?: string
          winner_wallet_address?: string | null
          xp_awarded?: number
        }
        Relationships: []
      }
      arena_queue: {
        Row: {
          created_at: string
          estimated_wait_seconds: number
          id: string
          matched_id: string | null
          mode: string
          player_name: string
          rating: number
          room_code: string | null
          selected_pet_id: string
          selected_species_id: string
          status: string
          updated_at: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          estimated_wait_seconds?: number
          id?: string
          matched_id?: string | null
          mode: string
          player_name: string
          rating?: number
          room_code?: string | null
          selected_pet_id: string
          selected_species_id: string
          status?: string
          updated_at?: string
          wallet_address: string
        }
        Update: {
          created_at?: string
          estimated_wait_seconds?: number
          id?: string
          matched_id?: string | null
          mode?: string
          player_name?: string
          rating?: number
          room_code?: string | null
          selected_pet_id?: string
          selected_species_id?: string
          status?: string
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      wallet_profiles: {
        Row: {
          avatar_species_id: string | null
          created_at: string
          display_name: string
          id: string
          last_seen_at: string
          losses: number
          rank_label: string
          rating: number
          updated_at: string
          wallet_address: string
          wins: number
        }
        Insert: {
          avatar_species_id?: string | null
          created_at?: string
          display_name: string
          id?: string
          last_seen_at?: string
          losses?: number
          rank_label?: string
          rating?: number
          updated_at?: string
          wallet_address: string
          wins?: number
        }
        Update: {
          avatar_species_id?: string | null
          created_at?: string
          display_name?: string
          id?: string
          last_seen_at?: string
          losses?: number
          rank_label?: string
          rating?: number
          updated_at?: string
          wallet_address?: string
          wins?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_arena_queue: {
        Args: { p_wallet_address: string }
        Returns: number
      }
      join_arena_queue: {
        Args: {
          p_mode: string
          p_pet_snapshot?: Json
          p_player_name: string
          p_rating?: number
          p_room_code?: string
          p_selected_pet_id: string
          p_selected_species_id: string
          p_wallet_address: string
        }
        Returns: {
          match_id: string
          queue_id: string
          status: string
        }[]
      }
      post_arena_chat: {
        Args: {
          p_emoji?: string
          p_match_id: string
          p_message?: string
          p_player_name: string
          p_wallet_address: string
        }
        Returns: string
      }
      submit_arena_move: {
        Args: {
          p_match_id: string
          p_move: string
          p_payload?: Json
          p_wallet_address: string
        }
        Returns: string
      }
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
