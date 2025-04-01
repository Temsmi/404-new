import { deleteSession } from 'app/lib/session'; // Import the deleteSession function

export async function POST(req) {
  try {
    // Delete the session (remove the cookie)
    await deleteSession();

    // Optionally, you can return a response (e.g., for confirmation)
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error during logout:', error);
    return new Response(JSON.stringify({ success: false, message: 'Failed to log out' }), { status: 500 });
  }
}
