import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

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