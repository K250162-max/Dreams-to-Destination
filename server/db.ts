import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  contactEnquiries,
  consultationRequests,
  InsertContactEnquiry,
  InsertConsultationRequest,
  InsertUser,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Create the database connection lazily.
export async function getDb() {
  if (_db) {
    return _db;
  }

  const databaseUrl = process.env.DATABASE_URL || ENV.databaseUrl;

  if (!databaseUrl) {
    console.error("[Database] DATABASE_URL is missing.");
    return null;
  }

  try {
    console.log("[Database] Connecting to database...");

    _db = drizzle(databaseUrl);

    console.log("[Database] Database connection initialized.");

    return _db;
  } catch (error) {
    console.error("[Database] Failed to initialize database:", error);
    _db = null;
    return null;
  }
}

// ---------------------------------------------------------
// USERS
// ---------------------------------------------------------

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();

  if (!db) {
    console.warn("[Database] Cannot upsert user: database unavailable.");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };

    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;

    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];

      if (value === undefined) {
        return;
      }

      const normalized = value ?? null;

      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }

    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });

    console.log("[Database] User saved successfully.");
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

// ---------------------------------------------------------
// GET USER
// ---------------------------------------------------------

export async function getUserByOpenId(openId: string) {
  const db = await getDb();

  if (!db) {
    console.warn("[Database] Cannot get user: database unavailable.");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.openId, openId))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get user:", error);
    throw error;
  }
}

// ---------------------------------------------------------
// CONSULTATION REQUEST
// ---------------------------------------------------------

export async function createConsultationRequest(
  input: InsertConsultationRequest,
) {
  console.log("[Database] Creating consultation request...");

  const db = await getDb();

  if (!db) {
    throw new Error("Database is unavailable");
  }

  try {
    const [result] = await db
      .insert(consultationRequests)
      .values(input);

    console.log(
      "[Database] Consultation request created:",
      Number(result.insertId),
    );

    return {
      id: Number(result.insertId),
    };
  } catch (error) {
    console.error(
      "[Database] Failed to create consultation request:",
      error,
    );

    throw error;
  }
}

// ---------------------------------------------------------
// CONTACT ENQUIRY
// ---------------------------------------------------------

export async function createContactEnquiry(
  input: InsertContactEnquiry,
) {
  console.log("[Database] Creating contact enquiry...");

  const db = await getDb();

  if (!db) {
    throw new Error("Database is unavailable");
  }

  try {
    const [result] = await db
      .insert(contactEnquiries)
      .values(input);

    console.log(
      "[Database] Contact enquiry created:",
      Number(result.insertId),
    );

    return {
      id: Number(result.insertId),
    };
  } catch (error) {
    console.error(
      "[Database] Failed to create contact enquiry:",
      error,
    );

    throw error;
  }
}