import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Query user from profiles table
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return NextResponse.json({
        error: 'Account not found. Please sign up first.'
      }, { status: 404 })
    }

    // Check password
    if (user.password !== password) {
      return NextResponse.json({
        error: 'Incorrect password. Please try again.'
      }, { status: 401 })
    }

    // Successful login
    return NextResponse.json({
      success: true,
      userType: user.user_type,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        userType: user.user_type
      }
    })

  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}