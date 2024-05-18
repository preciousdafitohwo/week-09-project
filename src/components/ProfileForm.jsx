import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export default async function ProfileForm() {
  const { userId } = auth();

  async function UpdateDb(formData) {
    "use server";
    const username = formData.get("username");
    const bio = formData.get("bio");

    await db.query(
      `UPDATE profiles SET username = $1, bio = $2 WHERE clerk_id = $3`,
      [username, bio, userId]
    );
    revalidatePath(`profile/${username}`);
    redirect(`profile/${username}`);
  }

  return (
    <div className="form-container">
      <h1 className="form-title">Update your profile</h1>
      <form className="profile-form" action={UpdateDb}>
        <label className="form-label" htmlFor="username">Username:</label>
        <input
          className="form-input"
          type="text"
          name="username"
          placeholder="Enter your username"
          required
        />
        <label className="form-label" htmlFor="bio">Bio:</label>
        <textarea
          className="form-textarea"
          name="bio"
          placeholder="Enter a short description about yourself"
          required
        ></textarea>
        <button className="form-button">Submit</button>
      </form>
    </div>
  );
}
