import { supabase, auth, db } from '../lib/supabase.js'

// Authentication services
export const authService = {
    // Sign up new user
    signUp: async (email, password, userData = {}) => {
        try {
            const { data, error } = await auth.signUp(email, password)
            if (error) throw error

            // If you want to store additional user data, you can do it here
            if (data.user && Object.keys(userData).length > 0) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        email: data.user.email,
                        ...userData
                    })
                if (profileError) console.error('Profile creation error:', profileError)
            }

            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        }
    },

    // Sign in user
    signIn: async (email, password) => {
        try {
            const { data, error } = await auth.signIn(email, password)
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        }
    },

    // Sign out user
    signOut: async () => {
        try {
            const { error } = await auth.signOut()
            if (error) throw error
            return { error: null }
        } catch (error) {
            return { error }
        }
    },

    // Get current user
    getCurrentUser: async () => {
        try {
            const { user, error } = await auth.getCurrentUser()
            if (error) throw error
            return { user, error: null }
        } catch (error) {
            return { user: null, error }
        }
    },

    // Listen to auth state changes
    onAuthStateChange: (callback) => {
        return auth.onAuthStateChange(callback)
    }
}

// Database services for your specific use cases
export const dataService = {
    // Example: Get all cases (kasus)
    getKasus: async (filters = {}) => {
        try {
            const { data, error } = await db.select('kasus', '*', filters)
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        }
    },

    // Example: Create new case (kasus)
    createKasus: async (kasusData) => {
        try {
            const { data, error } = await db.insert('kasus', kasusData)
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        }
    },

    // Example: Update case (kasus)
    updateKasus: async (id, updateData) => {
        try {
            const { data, error } = await db.update('kasus', updateData, { id })
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        }
    },

    // Example: Delete case (kasus)
    deleteKasus: async (id) => {
        try {
            const { data, error } = await db.delete('kasus', { id })
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        }
    },

    // Generic CRUD operations
    getRecords: async (table, filters = {}) => {
        try {
            const { data, error } = await db.select(table, '*', filters)
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        }
    },

    createRecord: async (table, recordData) => {
        try {
            const { data, error } = await db.insert(table, recordData)
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        }
    },

    updateRecord: async (table, id, updateData) => {
        try {
            const { data, error } = await db.update(table, updateData, { id })
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        }
    },

    deleteRecord: async (table, id) => {
        try {
            const { data, error } = await db.delete(table, { id })
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        }
    }
}

// File storage services
export const storageService = {
    // Upload file to Supabase storage
    uploadFile: async (bucket, path, file) => {
        try {
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(path, file)
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        }
    },

    // Get public URL for file
    getPublicUrl: (bucket, path) => {
        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(path)
        return data.publicUrl
    },

    // Delete file from storage
    deleteFile: async (bucket, path) => {
        try {
            const { data, error } = await supabase.storage
                .from(bucket)
                .remove([path])
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        }
    }
}

export default {
    auth: authService,
    data: dataService,
    storage: storageService
} 