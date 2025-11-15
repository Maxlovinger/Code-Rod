import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const email = request.headers.get('x-user-email')
    
    if (!email) {
      return NextResponse.json({ error: 'No user email provided' }, { status: 401 })
    }

    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Return user data with proper defaults for null values
    return NextResponse.json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      major: user.major || [],
      minor: user.minor || [],
      class_year: user.class_year || 1,
      advisors: user.advisors || [],
      user_type: user.user_type
    })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}