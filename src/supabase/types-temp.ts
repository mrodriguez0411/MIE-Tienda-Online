import { Database as SupabaseDatabase } from '@supabase/supabase-js';

export type Database = SupabaseDatabase & {
  auth: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['auth']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['auth']['Tables']['users']['Row']>
      }
    }
  };
  public: {
    Tables: {
      categories: {
        Row: {
          description?: string | null;
          id: string;
          name: string;
          parent_id?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          description?: string | null;
          id?: string;
          name: string;
          parent_id?: string | null;
        };
        Update: {
          description?: string | null;
          id?: string;
          name?: string;
          parent_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ]
      };
      customers: {
        Row: {
          address_id: string | null;
          created_at: string;
          email: string;
          first_name: string;
          id: string;
          last_name: string;
          phone: string | null;
        };
        Insert: {
          address_id?: string | null;
          created_at?: string;
          email: string;
          first_name: string;
          id?: string;
          last_name: string;
          phone?: string | null;
        };
        Update: {
          address_id?: string | null;
          created_at?: string;
          email?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          phone?: string | null;
        };
      };
    }
  }
};
