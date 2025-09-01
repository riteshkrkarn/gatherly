// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import EventModel from '@/model/Event.model';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit
    
    // Get total count for pagination
    const total = await EventModel.countDocuments({ status: 'open' })
    
    // Fetch only the fields you need for the card
    const events = await EventModel
      .find({ status: 'open' })
      .select('name description location image') // Only select needed fields
      .sort({ dateStarted: 1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    return NextResponse.json({
      events,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalEvents: total,
        hasMore: page < Math.ceil(total / limit)
      }
    })
  } catch (error) {
    
    return NextResponse.json(
      { error: error, message: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}