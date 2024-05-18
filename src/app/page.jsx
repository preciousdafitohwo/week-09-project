import { db } from "@/lib/db";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";


export default async function Home() {
  const { userId } = auth();
  const profiles = await db.query(
    `SELECT * FROM profiles WHERE clerk_id = $1`, [userId]
  );
  const username = profiles.rows[0]?.username;
  
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to MyBlog</h1>
      <SignedIn>
        <nav className="nav-menu">
          <ul className="nav-list">
            <li className="nav-item"><Link href="/profile" className="nav-link">Edit Profile</Link></li> 
            <li className="nav-item"><Link href={`profile/${username}`} className="nav-link">View Profile</Link></li> 
            <li className="nav-item"><Link href="/posts" className="nav-link">View Feed</Link></li>
          </ul>
        </nav>
      </SignedIn>
      <SignedOut>
        <h2 className="signed-out-message">Sign in to connect with other users and make a post...</h2>
      </SignedOut>
    </div>
  )
}