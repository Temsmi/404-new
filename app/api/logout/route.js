import { deleteSession } from 'app/lib/session';

export async function POST(req) {
  try {
    await deleteSession();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error during logout:', error);
    return new Response(JSON.stringify({ success: false, message: 'Failed to log out' }), { status: 500 });
  }
}
