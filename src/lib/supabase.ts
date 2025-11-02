import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  full_name?: string
  role: 'admin' | 'user' | 'moderator'
  created_at: string
  last_sign_in_at?: string
  avatar_url?: string
}

export interface FileItem {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploaded_by: string
  uploaded_at: string
}

export interface DashboardStats {
  total_users: number
  total_files: number
  storage_used: number
  active_sessions: number
}