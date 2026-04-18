import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      user_progress: {
        Row: {
          id: string
          device_id: string
          found_codes: string[]
          total_coins: number
          last_prize_redemption: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          device_id: string
          found_codes?: string[]
          total_coins?: number
          last_prize_redemption?: string | null
        }
        Update: {
          found_codes?: string[]
          total_coins?: number
          last_prize_redemption?: string | null
          updated_at?: string
        }
      }
      prize_redemptions: {
        Row: {
          id: string
          device_id: string
          found_count: number
          redemption_date: string
          created_at: string
        }
        Insert: {
          device_id: string
          found_count: number
          redemption_date: string
        }
        Update: never
      }
    }
  }
}

// Helper functions for database operations
export class SupabaseManager {
  static async getOrCreateUserProgress(deviceId: string) {
    try {
      // First try to get existing progress
      const { data: existingProgress, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('device_id', deviceId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user progress:', fetchError)
        return null
      }

      // If no existing progress, create new one
      if (!existingProgress) {
        const { data: newProgress, error: insertError } = await supabase
          .from('user_progress')
          .insert({
            device_id: deviceId,
            found_codes: [],
            total_coins: 0
          })
          .select()
          .single()

        if (insertError) {
          console.error('Error creating user progress:', insertError)
          return null
        }

        return newProgress
      }

      return existingProgress
    } catch (error) {
      console.error('Error in getOrCreateUserProgress:', error)
      return null
    }
  }

  static async updateUserProgress(deviceId: string, foundCodes: string[], totalCoins: number) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .update({
          found_codes: foundCodes,
          total_coins: totalCoins,
          updated_at: new Date().toISOString()
        })
        .eq('device_id', deviceId)
        .select()
        .single()

      if (error) {
        console.error('Error updating user progress:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in updateUserProgress:', error)
      return null
    }
  }

  static async recordPrizeRedemption(deviceId: string, foundCount: number) {
    try {
      // Record the prize redemption
      const { data: redemptionData, error: redemptionError } = await supabase
        .from('prize_redemptions')
        .insert({
          device_id: deviceId,
          found_count: foundCount,
          redemption_date: new Date().toISOString()
        })
        .select()
        .single()

      if (redemptionError) {
        console.error('Error recording prize redemption:', redemptionError)
        return null
      }

      // Update the last prize redemption in user progress
      const { error: updateError } = await supabase
        .from('user_progress')
        .update({
          last_prize_redemption: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('device_id', deviceId)

      if (updateError) {
        console.error('Error updating last prize redemption:', updateError)
        return null
      }

      return redemptionData
    } catch (error) {
      console.error('Error in recordPrizeRedemption:', error)
      return null
    }
  }

  static async canRedeemPrizeToday(deviceId: string): Promise<boolean> {
    try {
      const { data: progress, error } = await supabase
        .from('user_progress')
        .select('last_prize_redemption')
        .eq('device_id', deviceId)
        .single()

      if (error) {
        console.error('Error checking prize eligibility:', error)
        return true // Default to true if there's an error
      }

      if (!progress?.last_prize_redemption) {
        return true
      }

      const lastRedemption = new Date(progress.last_prize_redemption)
      const today = new Date()
      
      return lastRedemption.toDateString() !== today.toDateString()
    } catch (error) {
      console.error('Error in canRedeemPrizeToday:', error)
      return true // Default to true if there's an error
    }
  }

  static generateDeviceId(): string {
    // Generate a unique device ID based on browser fingerprint
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.fillText('Device fingerprint', 2, 2)
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|')
    
    return btoa(fingerprint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)
  }
}
