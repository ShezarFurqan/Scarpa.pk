// app/api/admin/login/route.js
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { email, password } = await req.json()

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: false }, { status: 401 })
}
