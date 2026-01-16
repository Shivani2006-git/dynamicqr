'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import crypto from 'crypto'

// Simple password hashing (for demo - use bcrypt in production)
function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex')
}

function verifyPassword(password: string, hash: string): boolean {
    return hashPassword(password) === hash
}

// Session management using cookies
async function createSession(userId: string) {
    const cookieStore = await cookies()
    cookieStore.set('user_id', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
    })
}

async function destroySession() {
    const cookieStore = await cookies()
    cookieStore.delete('user_id')
}

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = (formData.get('email') as string).trim().toLowerCase()
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    // Find user by email
    const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .limit(1)

    if (error) {
        console.error('Login error:', error)
        return { error: 'An error occurred during login' }
    }

    const user = users?.[0] as { id: string; email: string; password_hash: string } | undefined

    if (!user) {
        return { error: 'Invalid email or password' }
    }

    // Verify password
    if (!verifyPassword(password, user.password_hash)) {
        return { error: 'Invalid email or password' }
    }

    // Create session
    await createSession(user.id)

    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const name = (formData.get('name') as string)?.trim() || null
    const email = (formData.get('email') as string).trim().toLowerCase()
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return { error: 'Please enter a valid email address' }
    }

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' }
    }

    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' }
    }

    // Check if user already exists
    const { data: existingUsers } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .limit(1)

    if (existingUsers && existingUsers.length > 0) {
        return { error: 'An account with this email already exists' }
    }

    // Hash password and create user
    const passwordHash = hashPassword(password)

    const { data: newUser, error } = await supabase
        .from('users')
        .insert({
            email,
            password_hash: passwordHash,
            name
        } as never)
        .select()
        .single()

    if (error) {
        console.error('Signup error:', error)
        return { error: 'An error occurred during signup. Please try again.' }
    }

    // Auto-login after signup
    const user = newUser as { id: string }
    await createSession(user.id)

    redirect('/dashboard')
}

export async function logout() {
    await destroySession()
    redirect('/')
}

export async function getUser() {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user_id')?.value

    if (!userId) {
        return null
    }

    const supabase = await createClient()
    const { data: users } = await supabase
        .from('users')
        .select('id, email, name, created_at')
        .eq('id', userId)
        .limit(1)

    const user = users?.[0] as { id: string; email: string; name: string | null; created_at: string } | undefined
    return user || null
}

export async function getCurrentUserId() {
    const cookieStore = await cookies()
    return cookieStore.get('user_id')?.value || null
}
