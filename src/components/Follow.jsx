"use client";
import { useState } from "react";
import { handleFollow } from "@/lib/actions";

export default function FollowBtn({ currentProfileId }) {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleButtonClick = async () => {
    const success = await handleFollow(currentProfileId);
    if (success) {
      setIsFollowing(true);
    }
  };

  return (
    <button onClick={handleButtonClick} disabled={isFollowing}>
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}