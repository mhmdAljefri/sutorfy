export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          author_id: string
          content: string | null
          created_at: string | null
          draft: boolean | null
          id: number
          imageUrl: string | null
          ogImage: string | null
          publishingDate: string | null
          seoDescription: string | null
          seoTitle: string | null
          subTitle: string | null
          title: string
        }
        Insert: {
          author_id: string
          content?: string | null
          created_at?: string | null
          draft?: boolean | null
          id?: number
          imageUrl?: string | null
          ogImage?: string | null
          publishingDate?: string | null
          seoDescription?: string | null
          seoTitle?: string | null
          subTitle?: string | null
          title: string
        }
        Update: {
          author_id?: string
          content?: string | null
          created_at?: string | null
          draft?: boolean | null
          id?: number
          imageUrl?: string | null
          ogImage?: string | null
          publishingDate?: string | null
          seoDescription?: string | null
          seoTitle?: string | null
          subTitle?: string | null
          title?: string
        }
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
