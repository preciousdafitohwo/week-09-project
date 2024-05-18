import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import NotFound from "./not-found";
import Link from "next/link";
import FollowBtn from "@/components/Follow";


export default async function ProfilePage({ params }) {
  const { userId } = auth();

  const profiles = await db.query(
    `SELECT * FROM profiles WHERE username = $1`, [params.username]
  );

  if (profiles.rows.length === 0) {
    
    return <NotFound />;
  }

  const currentUser = await db.query(
    `SELECT * FROM profiles WHERE clerk_id = $1`, [userId]
  );

  const posts = await db.query(
    `SELECT * FROM posts JOIN profiles ON posts.profile_id = profiles.id WHERE username = $1`, [params.username]
  );

  const isCurrentUser = currentUser.rows[0]?.username === params.username;
  const currentProfileId = profiles.rows[0]?.id;

  return (
    <div className="profile-container">
      <SignedIn>
        <div className="profile-header">
          <h1>{`${profiles.rows[0]?.username}'s Profile`}</h1>
        </div>

        <div className="profile-info">
          <p><strong>Username:</strong> {profiles.rows[0]?.username}</p>
          <p><strong>Bio:</strong> {profiles.rows[0]?.bio}</p>
        </div>

        {!isCurrentUser && <FollowBtn currentProfileId={currentProfileId} />}

        <hr />
        <Link href="/posts" className="link">Post Feed</Link>
        <h1>Recent posts</h1>
        <div className="posts-wrapper">
          {posts.rows.map((post) => (
            <div key={post.id} className="post-item">
              <p><strong>{post.username}</strong> said: {post.content}</p>
            </div>
          ))}
        </div>
      </SignedIn>
      <SignedOut>
        <NotFound />
      </SignedOut>
    </div>
  );
}