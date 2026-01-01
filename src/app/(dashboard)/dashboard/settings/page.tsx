/**
 * Settings Page
 * Account settings and preferences (redirect to profile for now)
 */

import { redirect } from "next/navigation";

export default function SettingsPage() {
  redirect("/dashboard/profile");
}
