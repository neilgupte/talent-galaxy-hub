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
      answers: {
        Row: {
          ai_score: number | null
          answer_text: string
          application_id: string
          created_at: string
          id: string
          question_id: string
        }
        Insert: {
          ai_score?: number | null
          answer_text: string
          application_id: string
          created_at?: string
          id?: string
          question_id: string
        }
        Update: {
          ai_score?: number | null
          answer_text?: string
          application_id?: string
          created_at?: string
          id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          ai_score: number | null
          appeal_message: string | null
          applied_at: string
          feedback_text: string | null
          id: string
          job_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_score?: number | null
          appeal_message?: string | null
          applied_at?: string
          feedback_text?: string | null
          id?: string
          job_id: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_score?: number | null
          appeal_message?: string | null
          applied_at?: string
          feedback_text?: string | null
          id?: string
          job_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          plan_type: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          plan_type?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          plan_type?: string | null
        }
        Relationships: []
      }
      company_users: {
        Row: {
          company_id: string
          created_at: string
          role: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          role: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          admin_response: string | null
          ai_summary: string | null
          category: string
          created_at: string
          id: string
          is_critical: boolean | null
          message: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          ai_summary?: string | null
          category: string
          created_at?: string
          id?: string
          is_critical?: boolean | null
          message: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_response?: string | null
          ai_summary?: string | null
          category?: string
          created_at?: string
          id?: string
          is_critical?: boolean | null
          message?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaints_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      educations: {
        Row: {
          created_at: string
          degree: string
          end_year: number | null
          id: string
          institution: string
          profile_id: string
          start_year: number
        }
        Insert: {
          created_at?: string
          degree: string
          end_year?: number | null
          id?: string
          institution: string
          profile_id: string
          start_year: number
        }
        Update: {
          created_at?: string
          degree?: string
          end_year?: number | null
          id?: string
          institution?: string
          profile_id?: string
          start_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "educations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      experiences: {
        Row: {
          company: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          profile_id: string
          start_date: string
          title: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          profile_id: string
          start_date: string
          title: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          profile_id?: string
          start_date?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      hidden_jobs: {
        Row: {
          created_at: string
          id: string
          job_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hidden_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hidden_jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          city: string | null
          company_id: string
          country: string | null
          created_at: string
          currency: string | null
          description: string
          employment_type: string
          end_date: string
          id: string
          is_boosted: boolean | null
          is_high_priority: boolean | null
          job_level: string | null
          location: string
          onsite_type: string
          requirements: string | null
          salary_range: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          city?: string | null
          company_id: string
          country?: string | null
          created_at?: string
          currency?: string | null
          description: string
          employment_type: string
          end_date: string
          id?: string
          is_boosted?: boolean | null
          is_high_priority?: boolean | null
          job_level?: string | null
          location: string
          onsite_type: string
          requirements?: string | null
          salary_range?: string | null
          status: string
          title: string
          updated_at?: string
        }
        Update: {
          city?: string | null
          company_id?: string
          country?: string | null
          created_at?: string
          currency?: string | null
          description?: string
          employment_type?: string
          end_date?: string
          id?: string
          is_boosted?: boolean | null
          is_high_priority?: boolean | null
          job_level?: string | null
          location?: string
          onsite_type?: string
          requirements?: string | null
          salary_range?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company_name: string
          contact_email: string
          created_at: string
          id: string
          lead_score: number | null
          notes: string | null
          stage: string
          updated_at: string
        }
        Insert: {
          company_name: string
          contact_email: string
          created_at?: string
          id?: string
          lead_score?: number | null
          notes?: string | null
          stage: string
          updated_at?: string
        }
        Update: {
          company_name?: string
          contact_email?: string
          created_at?: string
          id?: string
          lead_score?: number | null
          notes?: string | null
          stage?: string
          updated_at?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          application_id: string
          author_user_id: string
          created_at: string
          id: string
          note_text: string
          rating_json: Json | null
        }
        Insert: {
          application_id: string
          author_user_id: string
          created_at?: string
          id?: string
          note_text: string
          rating_json?: Json | null
        }
        Update: {
          application_id?: string
          author_user_id?: string
          created_at?: string
          id?: string
          note_text?: string
          rating_json?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_author_user_id_fkey"
            columns: ["author_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      preferences: {
        Row: {
          alert_frequency: string | null
          job_titles: string[] | null
          locations: string[] | null
          notification_channels: string[] | null
          remote_only: boolean | null
          salary_range: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_frequency?: string | null
          job_titles?: string[] | null
          locations?: string[] | null
          notification_channels?: string[] | null
          remote_only?: boolean | null
          salary_range?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_frequency?: string | null
          job_titles?: string[] | null
          locations?: string[] | null
          notification_channels?: string[] | null
          remote_only?: boolean | null
          salary_range?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          current_title: string | null
          headline: string | null
          location: string | null
          skills: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          current_title?: string | null
          headline?: string | null
          location?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          current_title?: string | null
          headline?: string | null
          location?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          created_at: string
          id: string
          ideal_answer: string | null
          is_knockout: boolean | null
          is_required: boolean | null
          job_id: string
          question_text: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          ideal_answer?: string | null
          is_knockout?: boolean | null
          is_required?: boolean | null
          job_id: string
          question_text: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          ideal_answer?: string | null
          is_knockout?: boolean | null
          is_required?: boolean | null
          job_id?: string
          question_text?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          comment: string | null
          company_id: string
          created_at: string
          id: string
          job_seeker_id: string
          rating: number
        }
        Insert: {
          comment?: string | null
          company_id: string
          created_at?: string
          id?: string
          job_seeker_id: string
          rating: number
        }
        Update: {
          comment?: string | null
          company_id?: string
          created_at?: string
          id?: string
          job_seeker_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "ratings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_job_seeker_id_fkey"
            columns: ["job_seeker_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_jobs: {
        Row: {
          created_at: string
          id: string
          job_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_pool: {
        Row: {
          company_id: string
          created_at: string
          id: string
          notes: string | null
          profile_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          notes?: string | null
          profile_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "talent_pool_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_pool_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          role: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
