import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: advisors, error } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('user_type', 'advisor')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const formattedAdvisors = advisors?.map(advisor => ({
      id: advisor.id,
      name: advisor.full_name
    })) || []

    return NextResponse.json(formattedAdvisors)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}