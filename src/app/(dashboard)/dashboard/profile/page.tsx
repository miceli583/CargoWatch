/**
 * User Profile Page
 * View and edit profile information
 */

import { requireApprovedUser } from "~/lib/auth/server";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
  const user = await requireApprovedUser();

  return <ProfileClient user={user} />;
}
