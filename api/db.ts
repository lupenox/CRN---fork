import postgres from "postgres";

const ssl = Deno.env.get("DEV") === 'true' ? undefined : 'require';
const db = Deno.env.get("DATABASE");
export const sql = postgres(
  Deno.env.get("DATABASE_URL")!,
  {
    ssl: ssl,
    db: db
  }
);

await sql`
    DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('guest', 'member', 'admin');
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;
`;

await sql`
    DO $$ BEGIN
        CREATE TYPE resource_category AS ENUM (
          'Academic Support', 
          'Financial Services', 
          'Food & Dining', 
          'Health & Wellness', 
          'Campus Safety',
          'Technology',
          'Student Life'
        );
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;
`;

await sql`
    DO $$ BEGIN
        CREATE TYPE schedule_type AS ENUM ('LEC', 'IND', 'FLD', 'SEM', 'LAB', 'DIS');
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;
`;

export const USERS_TABLE_NAME = 'users';

await sql`
    CREATE TABLE IF NOT EXISTS ${sql(USERS_TABLE_NAME)} (
        id SERIAL PRIMARY KEY,
        auth0_id TEXT UNIQUE NOT NULL,
        name TEXT,
        email TEXT,
        type user_role
    );
`;

export const EVENTS_TABLE_NAME = 'event';

await sql`
    CREATE TABLE IF NOT EXISTS ${sql(EVENTS_TABLE_NAME)} (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        location TEXT,
        organizer TEXT,
        date TEXT,
        latitude NUMERIC,
        longitude NUMERIC
    );
`;

export const EVENT_STATS_TABLE_NAME = 'event_stats';

await sql`
    CREATE TABLE IF NOT EXISTS ${sql(EVENT_STATS_TABLE_NAME)} (
        id SERIAL PRIMARY KEY,
        eventid INTEGER REFERENCES ${sql(EVENTS_TABLE_NAME)}(id) ON DELETE CASCADE,
        accessrequests INTEGER
    );
`;

export const RESOURCES_TABLE_NAME = 'resource';

await sql`
    CREATE TABLE IF NOT EXISTS ${sql(RESOURCES_TABLE_NAME)} (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        category resource_category,
        description TEXT,
        location TEXT,
        address TEXT,
        phone TEXT,
        website TEXT,
        hours TEXT,
        latitude TEXT,
        longitude TEXT
    );
`;

export const REVIEWS_TABLE = 'review';

await sql`
    CREATE TABLE IF NOT EXISTS ${sql(REVIEWS_TABLE)} (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES ${sql(USERS_TABLE_NAME)}(id) ON DELETE CASCADE,
        event_id INTEGER REFERENCES ${sql(EVENTS_TABLE_NAME)}(id) ON DELETE CASCADE,
        resource_id INTEGER REFERENCES ${sql(RESOURCES_TABLE_NAME)}(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, user_id) -- Ensure one review per user per event
    );
`;

export const COURSES_TABLE_NAME = 'course';

await sql`
    CREATE TABLE IF NOT EXISTS ${sql(COURSES_TABLE_NAME)} (
        id SERIAL PRIMARY KEY,
        course_code TEXT,
        title TEXT NOT NULL,
        crn TEXT,
        section TEXT,
        schedule schedule_type,
        meets TEXT,
        instructor TEXT,
        campus TEXT,
        room TEXT
    );
`;