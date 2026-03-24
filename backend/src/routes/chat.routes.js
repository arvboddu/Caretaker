const { Router } = require('express');
const { supabase, supabaseAdmin } = require('../db/supabase');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = Router();

router.post('/threads', authMiddleware, async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.userId;

    const { data: existing } = await supabase
      .from('chat_threads')
      .select('id')
      .eq('booking_id', bookingId)
      .single();

    if (existing) {
      return res.json({ success: true, data: { id: existing.id, bookingId } });
    }

    const { data: thread, error } = await supabaseAdmin
      .from('chat_threads')
      .insert({ booking_id: bookingId })
      .select()
      .single();

    if (error) throw error;

    const { data: booking } = await supabase
      .from('bookings')
      .select('patient_id, caretaker_id')
      .eq('id', bookingId)
      .single();

    const { data: patient } = await supabase
      .from('patients')
      .select('user_id')
      .eq('id', booking.patient_id)
      .single();

    const { data: caretaker } = await supabase
      .from('caretakers')
      .select('user_id')
      .eq('id', booking.caretaker_id)
      .single();

    await supabaseAdmin.from('chat_participants').insert([
      { thread_id: thread.id, user_id: patient.user_id },
      { thread_id: thread.id, user_id: caretaker.user_id }
    ]);

    res.status(201).json({
      success: true,
      data: {
        id: thread.id,
        bookingId: thread.booking_id,
        participants: [patient.user_id, caretaker.user_id],
        createdAt: thread.created_at
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/threads', authMiddleware, async (req, res, next) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const userId = req.user.userId;

    const { data: participations } = await supabase
      .from('chat_participants')
      .select('thread_id')
      .eq('user_id', userId);

    const threadIds = participations?.map(p => p.thread_id) || [];

    if (threadIds.length === 0) {
      return res.json({ success: true, data: { threads: [], total: 0 } });
    }

    const { data: threads } = await supabase
      .from('chat_threads')
      .select(`
        *,
        booking:bookings(
          patient_id, caretaker_id,
          patient:patients(user_id),
          caretaker:caretakers(user_id)
        )
      `)
      .in('id', threadIds)
      .order('created_at', { ascending: false });

    const { data: lastMessages } = await supabase
      .from('messages')
      .select('thread_id, content, created_at')
      .in('thread_id', threadIds)
      .order('created_at', { ascending: false });

    const threadsWithDetails = await Promise.all(
      (threads || []).map(async (thread) => {
        const otherUserId = thread.booking?.patient?.user_id === userId
          ? thread.booking?.caretaker?.user_id
          : thread.booking?.patient?.user_id;

        const { data: otherUser } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', otherUserId)
          .single();

        const { data: profile } = await supabase
          .from('patients')
          .select('profile_photo')
          .eq('user_id', otherUserId)
          .single();

        const caretakerProfile = !profile ? await supabase
          .from('caretakers')
          .select('profile_photo')
          .eq('user_id', otherUserId)
          .single() : null;

        const { data: unread } = await supabase
          .from('messages')
          .select('id', { count: 'exact' })
          .eq('thread_id', thread.id)
          .neq('sender_id', userId)
          .neq('status', 'read');

        const lastMsg = lastMessages?.find(m => m.thread_id === thread.id);

        return {
          id: thread.id,
          otherUser: {
            id: otherUserId,
            fullName: otherUser?.full_name || 'User',
            profilePhoto: profile?.profile_photo || caretakerProfile?.data?.profile_photo
          },
          lastMessage: lastMsg ? {
            content: lastMsg.content,
            createdAt: lastMsg.created_at
          } : null,
          unreadCount: unread?.length || 0
        };
      })
    );

    res.json({
      success: true,
      data: {
        threads: threadsWithDetails,
        total: threadsWithDetails.length
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/threads/:threadId/messages', authMiddleware, async (req, res, next) => {
  try {
    const { threadId } = req.params;
    const { limit = 50, before } = req.query;
    const userId = req.user.userId;

    const { data: participation } = await supabase
      .from('chat_participants')
      .select('id')
      .eq('thread_id', threadId)
      .eq('user_id', userId)
      .single();

    if (!participation) {
      throw new ApiError(403, 'Not a participant in this thread');
    }

    let query = supabase
      .from('messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (before) {
      query = query.lt('created_at', before);
    }

    const { data: messages, error } = await query;

    if (error) throw error;

    await supabase
      .from('messages')
      .update({ status: 'read' })
      .eq('thread_id', threadId)
      .neq('sender_id', userId)
      .eq('status', 'delivered');

    res.json({
      success: true,
      data: {
        messages: messages?.reverse().map(m => ({
          id: m.id,
          content: m.content,
          senderId: m.sender_id,
          status: m.status,
          createdAt: m.created_at
        })),
        hasMore: messages?.length === parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/threads/:threadId/messages', authMiddleware, async (req, res, next) => {
  try {
    const { threadId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    const { data: participation } = await supabase
      .from('chat_participants')
      .select('id')
      .eq('thread_id', threadId)
      .eq('user_id', userId)
      .single();

    if (!participation) {
      throw new ApiError(403, 'Not a participant in this thread');
    }

    const { data: message, error } = await supabaseAdmin
      .from('messages')
      .insert({
        thread_id: threadId,
        sender_id: userId,
        content,
        status: 'sent'
      })
      .select()
      .single();

    if (error) throw error;

    if (req.io) {
      req.io.to(`chat:${threadId}`).emit('new_message', {
        id: message.id,
        content: message.content,
        senderId: message.sender_id,
        status: message.status,
        createdAt: message.created_at
      });
    }

    res.status(201).json({
      success: true,
      data: {
        id: message.id,
        content: message.content,
        senderId: message.sender_id,
        status: message.status,
        createdAt: message.created_at
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
