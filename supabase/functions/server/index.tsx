import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client with service role key
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? 'https://saeohtefpfuzzajfduad.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhZW9odGVwZnB1enphamZkdWFkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTE5ODM2MSwiZXhwIjoyMDg0Nzc0MzYxfQ.iHvCGrgYLwVRJfXB5lZL16cNiEJaRKPjOl2xJ_OrKtk';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhZW9odGVwZnB1enphamZkdWFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxOTgzNjEsImV4cCI6MjA4NDc3NDM2MX0.bxKkFIXrqVzRVU72E_zZHVGkWuVF_hyJVqvdYrRls9U';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-a62f57c7/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================================
// AI CHAT ENDPOINT - Anthropic Claude Integration
// ============================================================

// Rate limiting storage (in-memory for demo, use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Response cache to save API calls
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_DURATION = 3600000; // 1 hour

// Rate limiting helper
function checkRateLimit(identifier: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

// Clean old cache entries
function cleanCache() {
  const now = Date.now();
  for (const [key, value] of responseCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      responseCache.delete(key);
    }
  }
}

app.post("/make-server-a62f57c7/ai/chat", async (c) => {
  try {
    const body = await c.req.json();
    const { message, context } = body;

    // Input validation
    if (!message || typeof message !== 'string') {
      return c.json({ error: 'Message is required' }, 400);
    }

    // Max message length to prevent abuse
    if (message.length > 500) {
      return c.json({ error: 'Message too long. Max 500 characters.' }, 400);
    }

    // Prevent spam/abuse patterns
    const spamPatterns = [
      /(.)\1{10,}/i, // Repeated characters
      /https?:\/\//i, // URLs
      /<script/i, // Script tags
      /SELECT.*FROM/i, // SQL injection attempts
    ];
    
    for (const pattern of spamPatterns) {
      if (pattern.test(message)) {
        console.warn('Spam/abuse detected:', message.substring(0, 50));
        return c.json({ error: 'Invalid message content' }, 400);
      }
    }

    // Get client IP for rate limiting
    const clientIp = c.req.header('x-forwarded-for') || 
                     c.req.header('x-real-ip') || 
                     'unknown';
    
    // Rate limit: 10 requests per 5 minutes per IP
    if (!checkRateLimit(clientIp, 10, 300000)) {
      console.warn('Rate limit exceeded for IP:', clientIp);
      return c.json({ 
        error: 'Too many requests. Please wait a few minutes.',
        rateLimited: true 
      }, 429);
    }

    // Generate cache key
    const cacheKey = message.toLowerCase().trim().substring(0, 100);
    
    // Check cache first (save API calls!)
    cleanCache();
    const cached = responseCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log('Cache hit for message:', cacheKey.substring(0, 30));
      return c.json({
        success: true,
        message: cached.response,
        model: 'claude-3-5-sonnet',
        cached: true
      });
    }

    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    
    if (!anthropicApiKey) {
      console.error('ANTHROPIC_API_KEY not configured');
      return c.json({ error: 'AI service not configured' }, 500);
    }

    // ULTRA-COMPRESSED system prompt to save tokens
    const systemPrompt = `You are Roze Bot for Stepan Roze's portfolio (roze.live).

QUICK FACTS:
- Full-Stack Dev, 10+ yrs exp, Belgium 🇧🇪
- Email: stepan@roze.live
- Stack: React, Vue, Node.js, TypeScript, Magento 2
- Rates: €45-75/hr (Frontend to Full-Stack)
- Stats: 150+ projects, 50+ clients, 99% satisfaction
- Experience: Freelance (2015-19), Ronis (2019-22), eConsulting (2022-24)
- Languages: UA (native), EN (B1), NL (A2), ES (A1)

RULES:
1. Answer in 1-2 sentences max
2. Be direct, no fluff
3. Only portfolio topics (services, pricing, skills, contact)
4. For off-topic: "I can only help with Stepan's services. Email stepan@roze.live for details."
5. Use emojis sparingly (max 1 per response)`;

    // Call Anthropic API with minimal tokens
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022', // HAIKU = 5x cheaper than Sonnet!
        max_tokens: 150, // Reduced from 512 to 150 (save 72% tokens!)
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7 // Slightly lower for more consistent responses
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API error:', response.status, errorData);
      return c.json({ error: 'AI service temporarily unavailable' }, 500);
    }

    const data = await response.json();
    const aiMessage = data.content[0].text;

    // Cache the response
    responseCache.set(cacheKey, {
      response: aiMessage,
      timestamp: Date.now()
    });

    // Log usage for monitoring
    console.log(`AI request: ${message.substring(0, 30)}... | Tokens: input=${data.usage?.input_tokens || 0}, output=${data.usage?.output_tokens || 0}`);

    return c.json({
      success: true,
      message: aiMessage,
      model: 'claude-3-5-haiku',
      cached: false
    });

  } catch (error) {
    console.error('AI chat error:', error);
    return c.json({ 
      error: 'Failed to process request',
      details: error.message 
    }, 500);
  }
});

// ============================================================
// AUTH ENDPOINTS
// ============================================================

// Sign up endpoint - creates a new user with email/password
app.post("/make-server-a62f57c7/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || email.split('@')[0] },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Sign up error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      success: true, 
      user: data.user,
      message: 'User created successfully' 
    });
  } catch (error) {
    console.log('Sign up exception:', error);
    return c.json({ error: 'Internal server error during sign up' }, 500);
  }
});

// Get user info endpoint (requires auth)
app.get("/make-server-a62f57c7/auth/user", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      console.log('Get user error:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    return c.json({ user });
  } catch (error) {
    console.log('Get user exception:', error);
    return c.json({ error: 'Internal server error while getting user' }, 500);
  }
});

// Sign out endpoint (invalidates refresh token)
app.post("/make-server-a62f57c7/auth/signout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { error } = await supabaseAdmin.auth.admin.signOut(accessToken);

    if (error) {
      console.log('Sign out error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, message: 'Signed out successfully' });
  } catch (error) {
    console.log('Sign out exception:', error);
    return c.json({ error: 'Internal server error during sign out' }, 500);
  }
});

// ============================================================
// EXAMPLE PROTECTED ENDPOINT
// ============================================================

// Example: Get user's saved data (requires auth)
app.get("/make-server-a62f57c7/user/data", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      console.log('Authorization error while getting user data:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Example: Get user-specific data from KV store
    const userData = await kv.get(`user:${user.id}:profile`);

    return c.json({ 
      user: {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata
      },
      data: userData 
    });
  } catch (error) {
    console.log('Get user data exception:', error);
    return c.json({ error: 'Internal server error while fetching user data' }, 500);
  }
});

// Example: Save user data (requires auth)
app.post("/make-server-a62f57c7/user/data", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      console.log('Authorization error while saving user data:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();

    // Save user-specific data to KV store
    await kv.set(`user:${user.id}:profile`, body);

    return c.json({ 
      success: true,
      message: 'Data saved successfully' 
    });
  } catch (error) {
    console.log('Save user data exception:', error);
    return c.json({ error: 'Internal server error while saving user data' }, 500);
  }
});

// ============================================================
// BOOKING ENDPOINTS
// ============================================================

// Create a new booking (requires auth)
app.post("/make-server-a62f57c7/bookings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (authError || !user) {
      console.log('Booking auth error:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const booking = await c.req.json();

    // Generate unique booking ID
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Save booking to KV store with multiple keys for different queries
    const bookingData = {
      ...booking,
      id: bookingId,
      userId: user.id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Save with multiple keys for efficient queries
    await kv.set(`booking:${bookingId}`, bookingData);
    await kv.set(`user:${user.id}:booking:${bookingId}`, bookingData);
    
    // Add to user's booking list
    const userBookings = await kv.get(`user:${user.id}:bookings:list`) || [];
    userBookings.push(bookingId);
    await kv.set(`user:${user.id}:bookings:list`, userBookings);

    console.log(`Booking created: ${bookingId} for user ${user.id}`);

    return c.json({ 
      success: true, 
      booking: bookingData,
      message: 'Booking created successfully' 
    });
  } catch (error) {
    console.log('Create booking exception:', error);
    return c.json({ error: 'Internal server error while creating booking' }, 500);
  }
});

// Get all bookings for authenticated user
app.get("/make-server-a62f57c7/bookings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (authError || !user) {
      console.log('Get bookings auth error:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get user's booking list
    const bookingIds = await kv.get(`user:${user.id}:bookings:list`) || [];
    
    // Fetch all bookings
    const bookings = await Promise.all(
      bookingIds.map(async (id: string) => {
        return await kv.get(`booking:${id}`);
      })
    );

    // Filter out null values and sort by date (newest first)
    const validBookings = bookings
      .filter(b => b !== null)
      .sort((a: any, b: any) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    return c.json({ bookings: validBookings });
  } catch (error) {
    console.log('Get bookings exception:', error);
    return c.json({ error: 'Internal server error while fetching bookings' }, 500);
  }
});

// Cancel a booking (requires auth)
app.delete("/make-server-a62f57c7/bookings/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (authError || !user) {
      console.log('Cancel booking auth error:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const bookingId = c.req.param('id');
    
    // Get booking to verify ownership
    const booking = await kv.get(`booking:${bookingId}`);
    
    if (!booking) {
      return c.json({ error: 'Booking not found' }, 404);
    }

    if (booking.userId !== user.id) {
      return c.json({ error: 'You do not have permission to cancel this booking' }, 403);
    }

    // Update booking status to cancelled instead of deleting
    const updatedBooking = {
      ...booking,
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
    };

    await kv.set(`booking:${bookingId}`, updatedBooking);
    await kv.set(`user:${user.id}:booking:${bookingId}`, updatedBooking);

    console.log(`Booking cancelled: ${bookingId} by user ${user.id}`);

    return c.json({ 
      success: true, 
      message: 'Booking cancelled successfully' 
    });
  } catch (error) {
    console.log('Cancel booking exception:', error);
    return c.json({ error: 'Internal server error while cancelling booking' }, 500);
  }
});

// ============================================================
// PROJECT REACTIONS & COMMENTS ENDPOINTS
// ============================================================

// Get project reactions
app.get("/make-server-a62f57c7/projects/:projectId/reactions", async (c) => {
  try {
    const projectId = c.req.param('projectId');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const reactions = await kv.get(`project:${projectId}:reactions`) || {};
    
    let userReaction = null;
    if (accessToken) {
      const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken);
      if (user) {
        userReaction = await kv.get(`project:${projectId}:reaction:${user.id}`);
      }
    }

    return c.json({ reactions, userReaction });
  } catch (error) {
    console.log('Get reactions exception:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Toggle project reaction
app.post("/make-server-a62f57c7/projects/:projectId/reactions", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const projectId = c.req.param('projectId');
    const { reactionType } = await c.req.json();

    // Get current reactions
    const reactions = await kv.get(`project:${projectId}:reactions`) || {};
    const currentReaction = await kv.get(`project:${projectId}:reaction:${user.id}`);

    // Remove old reaction if exists
    if (currentReaction) {
      reactions[currentReaction] = Math.max(0, (reactions[currentReaction] || 0) - 1);
    }

    // Add new reaction if provided
    if (reactionType) {
      reactions[reactionType] = (reactions[reactionType] || 0) + 1;
      await kv.set(`project:${projectId}:reaction:${user.id}`, reactionType);
    } else {
      await kv.del(`project:${projectId}:reaction:${user.id}`);
    }

    await kv.set(`project:${projectId}:reactions`, reactions);

    return c.json({ success: true, reactions });
  } catch (error) {
    console.log('Toggle reaction exception:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get project comments
app.get("/make-server-a62f57c7/projects/:projectId/comments", async (c) => {
  try {
    const projectId = c.req.param('projectId');
    const comments = await kv.get(`project:${projectId}:comments`) || [];

    return c.json({ comments });
  } catch (error) {
    console.log('Get project comments exception:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Add project comment
app.post("/make-server-a62f57c7/projects/:projectId/comments", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const projectId = c.req.param('projectId');
    const { text } = await c.req.json();

    if (!text || !text.trim()) {
      return c.json({ error: 'Comment text is required' }, 400);
    }

    const comments = await kv.get(`project:${projectId}:comments`) || [];
    
    const newComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: text.trim(),
      userId: user.id,
      userName: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      userAvatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
      createdAt: new Date().toISOString(),
    };

    comments.unshift(newComment);
    await kv.set(`project:${projectId}:comments`, comments);

    return c.json({ success: true, comment: newComment });
  } catch (error) {
    console.log('Add project comment exception:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Delete project comment
app.delete("/make-server-a62f57c7/projects/:projectId/comments/:commentId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const projectId = c.req.param('projectId');
    const commentId = c.req.param('commentId');

    const comments = await kv.get(`project:${projectId}:comments`) || [];
    
    const commentIndex = comments.findIndex((c: any) => c.id === commentId);
    
    if (commentIndex === -1) {
      return c.json({ error: 'Comment not found' }, 404);
    }

    if (comments[commentIndex].userId !== user.id) {
      return c.json({ error: 'You can only delete your own comments' }, 403);
    }

    comments.splice(commentIndex, 1);
    await kv.set(`project:${projectId}:comments`, comments);

    return c.json({ success: true });
  } catch (error) {
    console.log('Delete project comment exception:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ============================================================
// TESTIMONIALS/REVIEWS ENDPOINTS
// ============================================================

// Get all testimonials
app.get("/make-server-a62f57c7/testimonials", async (c) => {
  try {
    // Get testimonials from KV store
    const testimonials = await kv.get('testimonials') || [];

    // Sort by date (newest first)
    testimonials.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ testimonials });
  } catch (error) {
    console.log('Get testimonials exception:', error);
    return c.json({ error: 'Internal server error while fetching testimonials' }, 500);
  }
});

// Add a testimonial (requires auth)
app.post("/make-server-a62f57c7/testimonials", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (authError || !user) {
      console.log('Add testimonial auth error:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { text, rating } = await c.req.json();

    if (!text || !text.trim()) {
      return c.json({ error: 'Testimonial text is required' }, 400);
    }

    if (!rating || rating < 1 || rating > 5) {
      return c.json({ error: 'Rating must be between 1 and 5' }, 400);
    }

    // Get existing testimonials
    const testimonials = await kv.get('testimonials') || [];

    // Check if user already left a testimonial
    const existingIndex = testimonials.findIndex((t: any) => t.userId === user.id);
    
    if (existingIndex !== -1) {
      // Update existing testimonial
      testimonials[existingIndex] = {
        ...testimonials[existingIndex],
        text: text.trim(),
        rating,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Create new testimonial
      const newTestimonial = {
        id: `testimonial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        userName: user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous',
        userAvatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        userRole: user.user_metadata?.role || 'Client',
        userCompany: user.user_metadata?.company || '',
        text: text.trim(),
        rating,
        featured: false, // Admin can feature testimonials later
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      testimonials.unshift(newTestimonial);
    }

    await kv.set('testimonials', testimonials);

    console.log(`Testimonial ${existingIndex !== -1 ? 'updated' : 'added'} by user ${user.id}`);

    return c.json({ success: true, testimonials });
  } catch (error) {
    console.log('Add testimonial exception:', error);
    return c.json({ error: 'Internal server error while adding testimonial' }, 500);
  }
});

// Delete a testimonial (requires auth and ownership)
app.delete("/make-server-a62f57c7/testimonials/:testimonialId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (authError || !user) {
      console.log('Delete testimonial auth error:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const testimonialId = c.req.param('testimonialId');

    // Get existing testimonials
    const testimonials = await kv.get('testimonials') || [];

    // Find and remove testimonial (only if user is the owner)
    const testimonialIndex = testimonials.findIndex((t: any) => t.id === testimonialId);
    
    if (testimonialIndex === -1) {
      return c.json({ error: 'Testimonial not found' }, 404);
    }

    if (testimonials[testimonialIndex].userId !== user.id) {
      return c.json({ error: 'You do not have permission to delete this testimonial' }, 403);
    }

    testimonials.splice(testimonialIndex, 1);
    await kv.set('testimonials', testimonials);

    console.log(`Testimonial ${testimonialId} deleted by user ${user.id}`);

    return c.json({ success: true, testimonials });
  } catch (error) {
    console.log('Delete testimonial exception:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error while deleting testimonial';
    const statusCode = errorMessage.includes('permission') ? 403 : 500;
    return c.json({ error: errorMessage }, statusCode);
  }
});

// ============================================================
// USER PROFILE ENDPOINTS
// ============================================================

// Upload avatar
app.post("/make-server-a62f57c7/upload-avatar", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (authError || !user) {
      console.log('Upload avatar auth error:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return c.json({ error: 'File must be an image' }, 400);
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return c.json({ error: 'File size must be less than 5MB' }, 400);
    }

    // Create bucket if it doesn't exist
    const bucketName = 'make-a62f57c7-avatars';
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      });
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.log('Upload error:', uploadError);
      return c.json({ error: 'Failed to upload file' }, 500);
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    console.log(`Avatar uploaded for user ${user.id}: ${urlData.publicUrl}`);

    return c.json({ url: urlData.publicUrl });
  } catch (error) {
    console.log('Upload avatar exception:', error);
    return c.json({ error: 'Internal server error while uploading avatar' }, 500);
  }
});

// Update user profile
app.post("/make-server-a62f57c7/update-profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (authError || !user) {
      console.log('Update profile auth error:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { name, role, company, avatar_url } = await c.req.json();

    // Update user metadata
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          name: name || user.user_metadata?.name,
          role: role || user.user_metadata?.role || '',
          company: company || user.user_metadata?.company || '',
          avatar_url: avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture,
        }
      }
    );

    if (error) {
      console.log('Update profile error:', error);
      return c.json({ error: 'Failed to update profile' }, 500);
    }

    console.log(`Profile updated for user ${user.id}`);

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log('Update profile exception:', error);
    return c.json({ error: 'Internal server error while updating profile' }, 500);
  }
});

// ============================================================
// CONTACT FORM ENDPOINT
// ============================================================

// Submit contact form
app.post("/make-server-a62f57c7/contact", async (c) => {
  try {
    const { name, email, service, message } = await c.req.json();

    if (!name || !email || !message) {
      return c.json({ error: 'All fields are required' }, 400);
    }

    // Save to KV store
    const contactId = `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const contactData = {
      id: contactId,
      name,
      email,
      service: service || 'Not specified',
      message,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`contact:${contactId}`, contactData);

    // Add to contacts list
    const contacts = await kv.get('contacts:list') || [];
    contacts.unshift(contactId);
    await kv.set('contacts:list', contacts.slice(0, 100)); // Keep last 100

    console.log(`Contact form submitted: ${contactId} from ${email}`);

    // Send email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (resendApiKey) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: ['rozedev095@gmail.com'],
            reply_to: email,
            subject: `New Contact from ${name} - ${service || 'General Inquiry'}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #00d9ff;">🚀 New Contact Form Submission</h2>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                  <p><strong>Service:</strong> ${service || 'Not specified'}</p>
                  <p><strong>Time:</strong> ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/Brussels' })} (Brussels)</p>
                </div>
                <div style="background: #fff; padding: 20px; border-left: 4px solid #00d9ff; margin: 20px 0;">
                  <h3 style="margin-top: 0;">Message:</h3>
                  <p style="white-space: pre-wrap;">${message}</p>
                </div>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #666; font-size: 12px;">
                  Contact ID: ${contactId}<br>
                  Sent from roze.live portfolio
                </p>
              </div>
            `,
          }),
        });

        if (!emailResponse.ok) {
          const errorData = await emailResponse.json();
          console.error('Resend API error:', errorData);
          console.log('Email failed to send, but contact saved to database');
        } else {
          console.log('Email sent successfully via Resend');
        }
      } catch (emailError) {
        console.error('Error sending email via Resend:', emailError);
        console.log('Email failed to send, but contact saved to database');
      }
    } else {
      console.log('RESEND_API_KEY not configured - skipping email');
    }

    return c.json({ 
      success: true, 
      message: 'Thank you for your message! I will get back to you soon.',
      contactId 
    });
  } catch (error) {
    console.log('Contact form exception:', error);
    return c.json({ error: 'Failed to submit contact form' }, 500);
  }
});

// ============================================================
// BOOK CALL ENDPOINT
// ============================================================

// Book a call (NO AUTH REQUIRED - guests can book)
app.post("/make-server-a62f57c7/book-call", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    // Try to get user if token provided, but don't require it
    let user = null;
    if (accessToken && accessToken !== supabaseAnonKey) {
      const { data: { user: authUser } } = await supabaseAdmin.auth.getUser(accessToken);
      user = authUser;
    }

    const body = await c.req.json();
    const { userId, userName, userEmail, date, time, timezone, purpose, notes, callType } = body;

    if (!date || !time) {
      return c.json({ error: 'Date and time are required' }, 400);
    }

    // Generate booking ID
    const bookingId = `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const bookingData = {
      id: bookingId,
      userId: user?.id || userId || 'guest',
      userName: user?.user_metadata?.name || userName || 'Guest User',
      userEmail: user?.email || userEmail || 'Not provided',
      date,
      time,
      timezone: timezone || 'Europe/Brussels',
      callType: callType || 'video',
      purpose: purpose || 'General inquiry',
      notes: notes || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    console.log('Saving booking:', bookingData);

    // Save to KV store
    await kv.set(`booking:${bookingId}`, bookingData);
    
    // If user is authenticated, also save to their bookings
    if (user?.id) {
      await kv.set(`user:${user.id}:booking:${bookingId}`, bookingData);
      
      const userBookings = await kv.get(`user:${user.id}:bookings:list`) || [];
      userBookings.push(bookingId);
      await kv.set(`user:${user.id}:bookings:list`, userBookings);
    }

    console.log('Booking saved successfully:', bookingId);

    return c.json({ 
      success: true, 
      booking: bookingData,
      message: 'Call booking created successfully'
    });
  } catch (error) {
    console.log('Book call exception:', error);
    return c.json({ error: 'Failed to book call' }, 500);
  }
});

Deno.serve(app.fetch);