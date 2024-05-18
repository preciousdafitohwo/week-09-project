"use server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function handleFollow(currentProfileId) {
  const { userId } = auth();

  try {
    const profiles = await db.query(`SELECT * FROM profiles WHERE clerk_id = $1`, [userId]);
    const profileId = profiles.rows[0].id;

    const follow = await db.query(`INSERT INTO follows (follower_id, followee_id) VALUES ($1, $2)`, [profileId, currentProfileId]);

    return follow.rowCount > 0;
  } catch (error) {
    console.error("Error following user:", error);
    return false;
  }
}