import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://odsgyptlgdbwnqbgrkdq.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kc2d5cHRsZ2Rid25xYmdya2RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzODgwOTgsImV4cCI6MjA2Njk2NDA5OH0.5d9pb5GZx4z5id7wBL78LoXgg9iSudvDJVYUeXTkx20"

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for common operations
export const auth = {
    // Sign up with email and password
    signUp: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })
        return { data, error }
    },

    // Sign in with email and password
    signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        return { data, error }
    },

    // Sign out
    signOut: async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
    },

    // Get current user
    getCurrentUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser()
        return { user, error }
    },

    // Listen to auth changes
    onAuthStateChange: (callback) => {
        return supabase.auth.onAuthStateChange(callback)
    }
}

// Database helper functions
export const db = {
    // Generic select function
    select: async (table, columns = '*', filters = {}) => {
        let query = supabase.from(table).select(columns)

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                query = query.eq(key, value)
            }
        })

        const { data, error } = await query
        return { data, error }
    },

    // Generic insert function
    insert: async (table, data) => {
        const { data: result, error } = await supabase
            .from(table)
            .insert(data)
            .select()
        return { data: result, error }
    },

    // Generic update function
    update: async (table, data, filters = {}) => {
        let query = supabase.from(table).update(data)

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                query = query.eq(key, value)
            }
        })

        const { data: result, error } = await query.select()
        return { data: result, error }
    },

    // Generic delete function
    delete: async (table, filters = {}) => {
        let query = supabase.from(table).delete()

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                query = query.eq(key, value)
            }
        })

        const { data, error } = await query
        return { data, error }
    }
}

export default supabase 