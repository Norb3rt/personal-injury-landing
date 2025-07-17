import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to California/Los Angeles with new structure
  redirect("/california/los-angeles")
}