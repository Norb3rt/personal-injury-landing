import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to Los Angeles as default
  redirect("/los-angeles")
}
