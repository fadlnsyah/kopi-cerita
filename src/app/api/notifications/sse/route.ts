import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/notifications/sse - Server-Sent Events for real-time notifications
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const encoder = new TextEncoder();
  const userId = session.user.id;
  
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)
      );
      
      // Poll for new notifications every 5 seconds
      const interval = setInterval(async () => {
        try {
          const notifications = await prisma.notification.findMany({
            where: {
              userId,
              isRead: false,
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          });
          
          if (notifications.length > 0) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'notifications', data: notifications })}\n\n`)
            );
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }, 5000);
      
      // Clean up on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
