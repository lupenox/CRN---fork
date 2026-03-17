import { getReviewsForEvent, getAverageRating, createReview } from "../util/review.ts";
import CrnResponse from "../util/httpResponse.ts";
import { verifyAuth0Token } from "../util/auth0.ts";

export async function GET(req : Request) {
    const url = new URL(req.url);
    const eventId = url.searchParams.get("event_id");
    if (!eventId) {
        return CrnResponse(null, 'Event ID is required', { status: 400 });
    }

    try {
        const id = parseInt(eventId);
        const reviews = await getReviewsForEvent(id);
        const stats = await getAverageRating(id);

        return CrnResponse({ reviews, stats });
    } catch (err) {
        return CrnResponse(null, String(err), { status: 500 });
    }
}

export async function POST(req : Request) {
    const user = await verifyAuth0Token(req);
    if (!user || !user.sub) {
        return CrnResponse(null, 'Unauthorized', { status: 401 });
    }
    let body;
    try {
        body = await req.json();
    } catch {
        return CrnResponse(null, 'Invalid JSON', { status: 400 });
    }
    const { event_id, rating, comment } = body;
    if (!event_id || typeof rating !== 'number' || rating < 1 || rating > 5) {
        return CrnResponse(null, 'Invalid event ID or rating', { status: 400 });
    }
    const success = await createReview({
        event_id,
        user_id: user.sub,
        rating,
        comment: comment || ""
    });
    if (success){
        return CrnResponse({ success: true, message: 'Review submitted successfully' });
    }else{
        return CrnResponse(null, 'Failed to submit review', { status: 500 });
    }
}