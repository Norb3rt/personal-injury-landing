import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function PersonalInjuryLawyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}