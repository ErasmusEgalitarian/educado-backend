//Keeps track of requests per IP in memory
const rateLimitMap = new Map<string, { count: number; last: number }>();

export default async (ctx, next) => {
  const ip = ctx.request.ip;
  const now = Date.now();
  // Allow max 10 requests per minute from the same IP  
  const limit = 10; 
  const windowMs = 60 * 1000; // per minute

  // Get or initialize entry for this IP 
  const entry = rateLimitMap.get(ip) || { count: 0, last: now };

  // Reset after window
  if (now - entry.last > windowMs) {
    entry.count = 0;
    entry.last = now;
  }
    // Increment count and update map 
  entry.count += 1;
  rateLimitMap.set(ip, entry);
  // Check limit 
  if (entry.count > limit) {
    return ctx.tooManyRequests('Too many login attempts, try again later.');
  }

  await next();
};
