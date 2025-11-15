import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from('profiles')
      .select('*')

    return NextResponse.json({ users, error })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}