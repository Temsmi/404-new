import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Secret key from environment variable
const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

// Encrypt payload and generate JWT
export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')  // Token expires after an hour
    .sign(encodedKey);
}

// Decrypt the JWT and verify its validity
export async function decryptSession(session) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.error('Failed to verify session:', error);
    return null;
  }
}

// Create a new session and store it in a cookie
export async function createSession(userId, role) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, role, expiresAt });
  
  const cookieStore = cookies(); // No need to `await` cookies()

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

// Get session from cookies and verify
export async function getSession() {
  const token = cookies().get('session')?.value; // No need to `await` here
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, encodedKey); // Use encodedKey, not key
    return payload;
  } catch (error) {
    console.error("Error verifying session:", error);
    return null;
  }
}

// Extend session expiry by renewing the cookie
export async function updateSession() {
  const sessionToken = cookies().get('session')?.value;
  const payload = await decryptSession(sessionToken);

  if (!sessionToken || !payload) {
    return null;
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const cookieStore = cookies();

  cookieStore.set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });

  return payload;
}

// Delete session by removing the session cookie
export async function deleteSession() {
  const cookieStore = cookies();
  cookieStore.delete('session');
}