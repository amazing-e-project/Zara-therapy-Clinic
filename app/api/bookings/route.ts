import { NextResponse } from 'next/server';
import { clientPromise } from '@/lib/mongodb';
import { ObjectId } from 'mongodb'; 

// CREATE A NEW APPOINTMENT (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userEmail, service, date, time } = body;

    if (!userEmail || !service || !date || !time) {
      return NextResponse.json({ error: 'Missing booking details' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('zara_clinic');

    const newBooking = await db.collection('bookings').insertOne({
      userEmail: userEmail.toLowerCase(),
      service,
      date,
      time,
      status: 'confirmed',
      createdAt: new Date()
    });

    return NextResponse.json({ message: 'Booking confirmed!', bookingId: newBooking.insertedId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server error', details: error.message }, { status: 500 });
  }
}

// CANCEL & WIPE BOOKING FROM DATABASE (DELETE)
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required to cancel' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('zara_clinic');

    const result = await db.collection('bookings').deleteOne({
      _id: new ObjectId(bookingId)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking completely removed' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server error', details: error.message }, { status: 500 });
  }
}