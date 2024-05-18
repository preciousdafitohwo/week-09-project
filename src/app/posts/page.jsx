import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export default async function Posts() {
  const { userId } = auth();

  const posts = await db.query(`SELECT * FROM posts JOIN profiles ON posts.profile_id = profiles.id`);

  const profiles = await db.query(
    `SELECT * FROM profiles WHERE clerk_id = '${userId}'`
  );
  const username = profiles.rows[0]?.username;

  async function handleAddPost(formData) {
    "use server";
    const content = formData.get("content");

    const result = await db.query(`SELECT * FROM profiles WHERE clerk_id = '${userId}'`);
    const profileId = result.rows[0].id;

    await db.query(`INSERT INTO posts (profile_id, content) VALUES ($1, $2)`, [profileId, content]);

    revalidatePath("/posts");
    redirect("/posts");
  }

  return (
    <div className="posts-container">
      <SignedIn>
        <div className="profile-link-container">
          <Link href={`profile/${username}`} className="link profile-link">
            View Profile
          </Link>
        </div>
        <div className="create-post">
          <h3>Create a new post</h3>
          <form action={handleAddPost}>
            <textarea name="content" placeholder="Type a post" required className="textarea"></textarea>
            <button className="submit-button">Submit</button>
          </form>
        </div>
      </SignedIn>
      <SignedOut>
        <p className="sign-in-message">Please sign in to add a post</p>
      </SignedOut>

      <h2>Posts Feed</h2>
      <hr />
      <div className="posts-wrapper">
        {posts.rows.map((post) => {
          return (
            <div key={post.id} className="post">
              <p>
                <Link href={`profile/${post.username}`} className="profile-link">
                  @{post.username}
                </Link>{" "}
                said: {post.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}