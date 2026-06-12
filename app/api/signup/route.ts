import { NextResponse } from 'next/server';
import { clientPromise } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, gender } = body;

    if (!name || !email || !password || !gender) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('zara_clinic');

    const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const newUser = await db.collection('users').insertOne({
      name,
      email: email.toLowerCase(),
      password, 
      gender,
      createdAt: new Date()
    });

    return NextResponse.json({ message: 'User registered successfully!', userId: newUser.insertedId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}