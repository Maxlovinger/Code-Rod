import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password, userType } = await request.json()

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        full_name: fullName,
        email,
        password,
        user_type: userType
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}