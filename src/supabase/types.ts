export interface Database {
  public: {
    Tables: {
      auth_users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
          user_metadata: {
            first_name: string;
            last_name: string;
            phone: string | null;
            role: string;
          };
        };
        Insert: {
          id: string;
          email: string;
          user_metadata: {
            first_name: string;
            last_name: string;
            phone: string | null;
            role: string;
          };
        };
        Update: {
          id: string;
          email: string;
          user_metadata: {
            first_name: string;
            last_name: string;
            phone: string | null;
            role: string;
          };
        }
      };
      addresses: {
        Row: {
          id: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string;
          postal_code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string;
          postal_code: string;
        };
        Update: {
          id?: string;
          address_line1?: string;
          address_line2?: string | null;
          city?: string;
          state?: string;
          postal_code?: string;
          created_at?: string;
          updated_at?: string;
        }
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description: string | null;
          parent_id: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      };
      customers: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          address_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          address_id: string | null;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          address_id?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      };
      orders: {
        Row: {
          id: string;
          customer_id: string;
          address_id: string;
          status: string;
          total: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          customer_id: string;
          address_id: string;
          status: string;
          total: number;
        };
        Update: {
          id?: string;
          customer_id?: string;
          address_id?: string;
          status?: string;
          total?: number;
          created_at?: string;
          updated_at?: string;
        }
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          stock: number;
          category_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description: string | null;
          price: number;
          stock: number;
          category_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          stock?: number;
          category_id?: string;
          created_at?: string;
          updated_at?: string;
        }
      };
      variants: {
        Row: {
          id: string;
          name: string;
          price: number;
          stock: number;
          product_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          price: number;
          stock: number;
          product_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          stock?: number;
          product_id?: string;
          created_at?: string;
          updated_at?: string;
        }
      }
    }
  }
}
    Tables: {
    Tables: {
      addresses: {
        Row: {
          id: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string;
          postal_code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string;
          postal_code: string;
        };
        Update: {
          id?: string;
          address_line1?: string;
          address_line2?: string | null;
          city?: string;
          state?: string;
          postal_code?: string;
          created_at?: string;
          updated_at?: string;
        }
      };

      categories: {
        Row: {
          description: string | null;
          id: string;
          name: string;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          description: string | null;
          name: string;
          parent_id: string | null;
        };
        Update: {
          id?: string;
          description?: string | null;
          name?: string;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        }
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
          address_id: string | null;
          email: string;
          first_name: string;
          last_name: string;
          phone: string | null;
        };
        Update: {
          id?: string;
          address_id?: string | null;
          created_at?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
        }
      };

      orders: {
        Row: {
          address_id: string;
          created_at: string;
          customer_id: string;
          id: string;
          status: string;
          total: number;
        };
        Insert: {
          address_id: string;
          customer_id: string;
          status: string;
          total: number;
        };
        Update: {
          id?: string;
          address_id?: string;
          created_at?: string;
          customer_id?: string;
          status?: string;
          total?: number;
        }
      };

      products: {
        Row: {
          category_id: string;
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          price: number;
          stock: number;
        };
        Insert: {
          category_id: string;
          description: string | null;
          name: string;
          price: number;
          stock: number;
        };
        Update: {
          id?: string;
          category_id?: string;
          created_at?: string;
          description?: string | null;
          name?: string;
          price?: number;
          stock?: number;
        }
      };

      variants: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          price: number;
          product_id: string;
          stock: number;
        };
        Insert: {
          name: string;
          price: number;
          product_id: string;
          stock: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          price?: number;
          product_id?: string;
          stock?: number;
        }
      };

      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          price?: number;
          created_at?: string;
          updated_at?: string;
        }
      };
    }
  };

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
        Insert: {
          email: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          role: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        }
      }
    }
  }
}
        };
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['customers']['Row']>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Row']>;
      };
      orders: {
        Row: {
          id: string;
          customer_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Row']>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['order_items']['Row']>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          category_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Row']>;
      };
    };
  };
};
