// pages/api/clerk-webhook.js
import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import { Clerk } from '@clerk/nextjs/server';

export async function POST(req) {
  const { userId, email } = req.body; // Adjust according to your Clerk webhook payload

  // Connect to MongoDB
  const client = await clientPromise;
  const db = client.db('mydatabase');
  const usersCollection = db.collection('users');

  // Check if user already exists
  const existingUser = await usersCollection.findOne({ userId });

  if (existingUser) {
    // Update user data
    await usersCollection.updateOne(
      { userId },
      { $set: { email, updatedAt: new Date() } }
    );
  } else {
    // Insert new user
    await usersCollection.insertOne({
      userId,
      email,
      createdAt: new Date(),
    });
  }

  return NextResponse.json({ success: true });
}
