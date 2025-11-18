import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to California/Los Angeles with new URL structure
  redirect("/personal-injury-lawyer/california/los-angeles")
}