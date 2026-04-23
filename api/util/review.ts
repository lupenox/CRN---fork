import { sql, REVIEWS_TABLE } from "../db.ts";

export type Review = {
    event_id: number;
    user_id: string;
    rating: number;
    comment: string;
};

export const getReviewsForEvent = async (eventId: number) => {
    return await sql`
        SELECT r.id, r.rating, r.comment, r.created_at, u.first_name, u.username
        FROM ${sql(REVIEWS_TABLE)} r
        JOIN users u ON r.user_id = u.id
        WHERE r.event_id = ${eventId}
        ORDER BY r.created_at DESC;
    `;
}

export const getAverageRating = async (eventId: number) => {
    const result = await sql`
        SELECT ROUND(AVG(rating), 1) AS average_rating, COUNT(id) AS total_reviews
        FROM ${sql(REVIEWS_TABLE)}
        WHERE event_id = ${eventId}
    `;
    return result[0];
}

export async function createReview( review: Review ) {
    try {
        await sql`
            INSERT INTO ${sql(REVIEWS_TABLE)} (event_id, user_id, rating, comment)
            VALUES (${review.event_id}, ${review.user_id}, ${review.rating}, ${review.comment})
            ON CONFLICT (event_id, user_id) DO UPDATE 
            SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, created_at = CURRENT_TIMESTAMP;
        `;
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}