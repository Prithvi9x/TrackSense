import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './useAuth'

// Centralizes all expense queries so components stay simple. RLS on the
// `expenses` table already restricts rows to the current user, but we still
// scope queries by user_id for clarity and defense in depth.
export function useExpenses({ start, end } = {}) {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)

    let query = supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (start) query = query.gte('date', start)
    if (end) query = query.lte('date', end)

    const { data, error: err } = await query
    if (err) {
      setError(err.message)
    } else {
      setExpenses(data ?? [])
    }
    setLoading(false)
  }, [user, start, end])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addExpense = useCallback(
    async (expense) => {
      const { error: err } = await supabase
        .from('expenses')
        .insert([{ ...expense, user_id: user.id }])
      if (err) throw err
      await refresh()
    },
    [user, refresh]
  )

  const updateExpense = useCallback(
    async (id, updates) => {
      const { error: err } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
      if (err) throw err
      await refresh()
    },
    [user, refresh]
  )

  const deleteExpense = useCallback(
    async (id) => {
      const { error: err } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
      if (err) throw err
      await refresh()
    },
    [user, refresh]
  )

  const bulkInsert = useCallback(
    async (rows) => {
      const withUser = rows.map((r) => ({ ...r, user_id: user.id }))
      const { error: err } = await supabase.from('expenses').insert(withUser)
      if (err) throw err
      await refresh()
    },
    [user, refresh]
  )

  return { expenses, loading, error, refresh, addExpense, updateExpense, deleteExpense, bulkInsert }
}
