import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css"; 

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import ProfileForm from "@/components/ProfileForm";

export default async function RootLayout({ children }) {
  const { userId } = auth();

  const profiles = await db.query(
    `SELECT * FROM profiles WHERE clerk_id = $1`, [userId]
  );

  if (profiles.rowCount === 0 && userId) {
    await db.query(`INSERT INTO profiles (clerk_id) VALUES ($1)`, [userId]);
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header className="header">
            <nav className="nav">
              <Link href="/" className="link">Home Page</Link>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </nav>
          </header>
          <main className="main-content">
            <SignedIn>
              {profiles.rows[0]?.username && children}
              {!profiles.rows[0]?.username && <ProfileForm />}
            </SignedIn>
            <SignedOut>{children}</SignedOut>
          </main>
          <footer className="footer">
            <p>Made by Precious Dafitohwo &copy; 2024</p>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}