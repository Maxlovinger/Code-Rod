import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { major, minor, classYear, advisors } = await request.json()
    const email = request.headers.get('x-user-email')
    
    console.log('Update request data:', { major, minor, classYear, advisors, email })

    if (!email) {
      return NextResponse.json({ error: 'No user email provided' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        major,
        minor,
        class_year: classYear,
        advisors
      })
      .eq('email', email)

    console.log('Update result:', { data, error })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.log('Server error in update:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}