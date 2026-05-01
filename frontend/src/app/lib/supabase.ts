import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase - Reemplaza con tus credenciales reales
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://inubqjubhocnfkawziqx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Solo crear el cliente si tenemos credenciales válidas
export const supabase = supabaseUrl && supabaseAnonKey && supabaseAnonKey.length > 50
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = Boolean(supabase);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          created_at: string;
          balance: number;
          level: number;
          avatar_url: string | null;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          created_at?: string;
          balance?: number;
          level?: number;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          created_at?: string;
          balance?: number;
          level?: number;
          avatar_url?: string | null;
        };
      };
      inventory: {
        Row: {
          id: string;
          user_id: string;
          item_name: string;
          rarity: string;
          value: number;
          case_id: number;
          obtained_at: string;
          is_listed: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_name: string;
          rarity: string;
          value: number;
          case_id: number;
          obtained_at?: string;
          is_listed?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_name?: string;
          rarity?: string;
          value?: number;
          case_id?: number;
          obtained_at?: string;
          is_listed?: boolean;
        };
      };
      case_openings: {
        Row: {
          id: string;
          user_id: string;
          case_id: number;
          case_name: string;
          item_name: string;
          rarity: string;
          value: number;
          opened_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          case_id: number;
          case_name: string;
          item_name: string;
          rarity: string;
          value: number;
          opened_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          case_id?: number;
          case_name?: string;
          item_name?: string;
          rarity?: string;
          value?: number;
          opened_at?: string;
        };
      };
      marketplace_listings: {
        Row: {
          id: string;
          seller_id: string;
          inventory_id: string;
          item_name: string;
          rarity: string;
          price: number;
          created_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          inventory_id: string;
          item_name: string;
          rarity: string;
          price: number;
          created_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          inventory_id?: string;
          item_name?: string;
          rarity?: string;
          price?: number;
          created_at?: string;
          status?: string;
        };
      };
    };
  };
}