/**
 * Database Helper using Supabase Client
 * 
 * Gunakan fungsi-fungsi ini untuk operasi database
 * karena direct PostgreSQL connection mungkin dibatasi oleh Supabase
 */

import { supabase } from './supabase'

export const db = {
  users: {
    /**
     * Find all users
     */
    async findMany() {
      const { data, error } = await supabase.from('users').select('*')
      if (error) throw error
      return data
    },

    /**
     * Find user by ID
     */
    async findById(id: string) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },

    /**
     * Find user by email
     */
    async findByEmail(email: string) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
      if (error) throw error
      return data
    },

    /**
     * Create new user
     */
    async create(userData: {
      id: string
      email: string
      password: string
      name?: string
      role?: string
    }) {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single()
      if (error) throw error
      return data
    },

    /**
     * Update user
     */
    async update(id: string, userData: Partial<{
      email: string
      password: string
      name: string
      role: string
    }>) {
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },

    /**
     * Delete user
     */
    async delete(id: string) {
      const { error } = await supabase.from('users').delete().eq('id', id)
      if (error) throw error
    },
  },

  orders: {
    /**
     * Find all orders
     */
    async findMany() {
      const { data, error } = await supabase
        .from('orders')
        .select('*, users(*)')
      if (error) throw error
      return data
    },

    /**
     * Find order by ID
     */
    async findById(id: string) {
      const { data, error } = await supabase
        .from('orders')
        .select('*, users(*)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },

    /**
     * Find order by code
     */
    async findByCode(code: string) {
      const { data, error } = await supabase
        .from('orders')
        .select('*, users(*)')
        .eq('code', code)
        .single()
      if (error) throw error
      return data
    },

    /**
     * Find orders by user ID
     */
    async findByUserId(userId: string) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
      if (error) throw error
      return data
    },

    /**
     * Create new order
     */
    async create(orderData: {
      id: string
      code: string
      user_id: string
      items: unknown
      total_amount: number
      status?: string
      kegiatan?: string | null
      tamu?: string | null
      jumlah_tamu?: number | null
      bagian?: string | null
      pengaju?: string | null
      tanggal_pengajuan?: string | null
      tanggal_pengiriman?: string | null
      approval?: string | null
      lokasi?: string | null
      waktu?: string | null
      keterangan?: string | null
    }) {
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()
      if (error) throw error
      return data
    },

    /**
     * Update order
     */
    async update(id: string, orderData: Partial<{
      items: unknown
      total_amount: number
      status: string
      kegiatan: string | null
      tamu: string | null
      jumlah_tamu: number | null
      bagian: string | null
      pengaju: string | null
      tanggal_pengajuan: string | null
      tanggal_pengiriman: string | null
      approval: string | null
      lokasi: string | null
      waktu: string | null
      keterangan: string | null
    }>) {
      const { data, error } = await supabase
        .from('orders')
        .update(orderData)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },

    /**
     * Delete order
     */
    async delete(id: string) {
      const { error } = await supabase.from('orders').delete().eq('id', id)
      if (error) throw error
    },
  },
}
