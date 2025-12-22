import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET - Get all divisions
export async function GET() {
  try {
    const { data: divisions, error } = await supabase
      .from('divisions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching divisions:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ divisions: divisions || [] })
  } catch (error) {
    console.error('Error in GET /api/divisions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new division
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, code, description } = body

    if (!name || !code) {
      return NextResponse.json(
        { error: 'Name and code are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('divisions')
      .insert([
        {
          name,
          code: code.toUpperCase(),
          description
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating division:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ division: data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/divisions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update division
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, code, description } = body

    if (!id || !name || !code) {
      return NextResponse.json(
        { error: 'ID, name and code are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('divisions')
      .update({
        name,
        code: code.toUpperCase(),
        description
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating division:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ division: data })
  } catch (error) {
    console.error('Error in PUT /api/divisions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete division
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('divisions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting division:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Division deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/divisions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
