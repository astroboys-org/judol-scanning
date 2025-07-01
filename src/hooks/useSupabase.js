import { useState, useEffect } from 'react'
import { authService, dataService } from '../services/supabaseService.js'

export const useAuth = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Get initial user
        const getInitialUser = async () => {
            try {
                const { user, error } = await authService.getCurrentUser()
                if (error) throw error
                setUser(user)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        getInitialUser()

        // Listen for auth changes
        const { data: { subscription } } = authService.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null)
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const signUp = async (email, password, userData = {}) => {
        setLoading(true)
        setError(null)
        try {
            const { data, error } = await authService.signUp(email, password, userData)
            if (error) throw error
            return { data, error: null }
        } catch (err) {
            setError(err.message)
            return { data: null, error: err.message }
        } finally {
            setLoading(false)
        }
    }

    const signIn = async (email, password) => {
        setLoading(true)
        setError(null)
        try {
            const { data, error } = await authService.signIn(email, password)
            if (error) throw error
            return { data, error: null }
        } catch (err) {
            setError(err.message)
            return { data: null, error: err.message }
        } finally {
            setLoading(false)
        }
    }

    const signOut = async () => {
        setLoading(true)
        setError(null)
        try {
            const { error } = await authService.signOut()
            if (error) throw error
            setUser(null)
            return { error: null }
        } catch (err) {
            setError(err.message)
            return { error: err.message }
        } finally {
            setLoading(false)
        }
    }

    return {
        user,
        loading,
        error,
        signUp,
        signIn,
        signOut,
        isAuthenticated: !!user
    }
}

export const useData = (table, filters = {}) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            const { data: result, error } = await dataService.getRecords(table, filters)
            if (error) throw error
            setData(result)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (table) {
            fetchData()
        }
    }, [table, JSON.stringify(filters)])

    const createRecord = async (recordData) => {
        setLoading(true)
        setError(null)
        try {
            const { data: result, error } = await dataService.createRecord(table, recordData)
            if (error) throw error
            setData(prev => [...prev, result[0]])
            return { data: result, error: null }
        } catch (err) {
            setError(err.message)
            return { data: null, error: err.message }
        } finally {
            setLoading(false)
        }
    }

    const updateRecord = async (id, updateData) => {
        setLoading(true)
        setError(null)
        try {
            const { data: result, error } = await dataService.updateRecord(table, id, updateData)
            if (error) throw error
            setData(prev => prev.map(item => item.id === id ? result[0] : item))
            return { data: result, error: null }
        } catch (err) {
            setError(err.message)
            return { data: null, error: err.message }
        } finally {
            setLoading(false)
        }
    }

    const deleteRecord = async (id) => {
        setLoading(true)
        setError(null)
        try {
            const { data, error } = await dataService.deleteRecord(table, id)
            if (error) throw error
            setData(prev => prev.filter(item => item.id !== id))
            return { data, error: null }
        } catch (err) {
            setError(err.message)
            return { data: null, error: err.message }
        } finally {
            setLoading(false)
        }
    }

    return {
        data,
        loading,
        error,
        createRecord,
        updateRecord,
        deleteRecord,
        refetch: fetchData
    }
}

export const useKasus = (filters = {}) => {
    return useData('kasus', filters)
} 