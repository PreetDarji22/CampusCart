import Event from '../models/Event.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all active upcoming campus events
// @route   GET /api/events
// @access  Public
export const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
});

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  res.status(200).json({
    success: true,
    data: event
  });
});

// @desc    Create new event (Admin only)
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    category,
    date,
    time,
    venue,
    entryFee,
    totalSlots,
    gearTag,
    organizer,
    bannerImage
  } = req.body;

  if (!title || !description || !date || !venue) {
    return next(new AppError('Please provide title, description, date, and venue.', 400));
  }

  const event = await Event.create({
    title,
    description,
    category: category || 'Tech Fest',
    date,
    time: time || '09:00 AM - 05:00 PM',
    venue,
    entryFee: entryFee !== undefined ? Number(entryFee) : 0,
    totalSlots: totalSlots !== undefined ? Number(totalSlots) : 100,
    gearTag: gearTag || 'Relevant Marketplace Gear in High Demand',
    organizer: organizer || 'Campus Department & Student Council',
    bannerImage: bannerImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    createdBy: req.user ? req.user._id : undefined
  });

  res.status(201).json({
    success: true,
    message: 'Campus event published successfully!',
    data: event
  });
});

// @desc    Register / Book Tickets for an Event (Students & Admins)
// @route   POST /api/events/:id/register
// @access  Public / Student
export const registerForEvent = asyncHandler(async (req, res, next) => {
  const { name, email, rollNumber, department, ticketsCount } = req.body;
  const eventId = req.params.id;

  if (!name || !email) {
    return next(new AppError('Please provide student name and college email.', 400));
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found.', 404));
  }

  const countToBook = Number(ticketsCount) || 1;

  // Check slot capacity
  if (event.registeredCount + countToBook > event.totalSlots) {
    return next(new AppError(`Only ${event.totalSlots - event.registeredCount} slots remaining for this event.`, 400));
  }

  // Generate unique Ticket Pass Code
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const prefix = (event.category || 'CAMPUS').substring(0, 4).toUpperCase();
  const ticketId = `TKT-${prefix}-${randomSuffix}`;

  const bookingRecord = {
    userId: req.user ? req.user._id : undefined,
    name,
    email: email.toLowerCase().trim(),
    rollNumber: rollNumber || 'STUDENT',
    department: department || 'Engineering',
    ticketId,
    ticketsCount: countToBook,
    amountPaid: event.entryFee * countToBook,
    bookedAt: new Date()
  };

  event.registeredUsers.push(bookingRecord);
  event.registeredCount += countToBook;

  await event.save();

  res.status(200).json({
    success: true,
    message: `🎉 Successfully registered for ${event.title}!`,
    data: {
      eventTitle: event.title,
      category: event.category,
      date: event.date,
      time: event.time,
      venue: event.venue,
      ticketId,
      attendeeName: name,
      attendeeEmail: email,
      rollNumber: rollNumber || '',
      department: department || '',
      ticketsCount: countToBook,
      amountPaid: event.entryFee * countToBook
    }
  });
});

// @desc    Delete an event (Admin only)
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  await event.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully.'
  });
});
