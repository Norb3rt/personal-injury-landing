import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowLeft } from "lucide-react";
import { StateDataLoader } from "@/lib/data/state-loader";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { StickyFooterCTA } from "@/components/sticky-footer-cta";

export const metadata: Metadata = {
  title: "Personal Injury Lawyer Locations by State | LawProactive",
  description:
    "Browse all cities where LawProactive connects you with experienced personal injury attorneys. Find local legal help across California, Texas, Florida, New York, and Arizona.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN || "https://personalinjury.lawproactive.com"}/locations`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Group cities by state for display
type StateGroup = {
  stateName: string;
  stateSlug: string;
  abbreviation: string;
  cities: Array<{ name: string; slug: string; population?: number }>;
};

export default async function LocationsPage() {
  const allLocations = await StateDataLoader.getAllProcessedLocations();

  // Group by state and sort cities within each state by population (desc)
  const stateMap = new Map<string, StateGroup>();
  for (const loc of allLocations) {
    let group = stateMap.get(loc.stateSlug);
    if (!group) {
      // Config fetch gives us the display name + abbreviation
      const config = await StateDataLoader.getStateConfig(loc.stateSlug).catch(
        () => null,
      );
      group = {
        stateName: config?.name || loc.state,
        stateSlug: loc.stateSlug,
        abbreviation:
          config?.abbreviation || loc.stateSlug.toUpperCase().slice(0, 2),
        cities: [],
      };
      stateMap.set(loc.stateSlug, group);
    }
    group.cities.push({
      name: loc.city,
      slug: loc.citySlug,
      population: loc.population,
    });
  }

  const stateGroups = Array.from(stateMap.values()).sort((a, b) =>
    a.stateName.localeCompare(b.stateName),
  );
  // Sort cities within each state by population (largest first)
  for (const group of stateGroups) {
    group.cities.sort((a, b) => (b.population || 0) - (a.population || 0));
  }

  const totalCities = allLocations.length;

  return (
    <AnalyticsProvider>
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section
          className="relative text-white py-16 px-4 overflow-hidden"
          style={{ backgroundColor: "#0B6B65" }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative max-w-5xl mx-auto text-center">
            <FadeIn direction="up" delay={0.1}>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Find a Personal Injury Lawyer Near You
              </h1>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
                Browse our growing network of local personal injury attorneys
                across the United States. Connect with an experienced lawyer in
                your area for a free case evaluation.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* State/City directory */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            {/* Quick state navigation */}
            <FadeIn direction="up" delay={0.1}>
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                {stateGroups.map((group) => (
                  <a
                    key={group.stateSlug}
                    href={`#state-${group.stateSlug}`}
                    className="px-4 py-2 rounded-full border border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all text-sm font-medium"
                  >
                    {group.stateName}
                  </a>
                ))}
              </div>
            </FadeIn>

            {stateGroups.map((group) => (
              <div
                key={group.stateSlug}
                id={`state-${group.stateSlug}`}
                className="mb-16 scroll-mt-8"
              >
                <FadeIn direction="up" delay={0.1}>
                  <div className="flex items-baseline gap-3 mb-6 pb-3 border-b-2 border-teal-100">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {group.stateName}
                    </h2>
                    <span className="text-sm text-gray-500 uppercase tracking-wide">
                      {group.abbreviation} · {group.cities.length} cities
                    </span>
                  </div>
                </FadeIn>

                <StaggerContainer
                  staggerDelay={0.03}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
                >
                  {group.cities.map((city) => (
                    <StaggerItem key={`${group.stateSlug}-${city.slug}`}>
                      <Link
                        href={`/personal-injury-lawyer/${group.stateSlug}/${city.slug}`}
                        className="block"
                      >
                        <div className="p-3 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-teal-200 hover:scale-[1.02] transition-all duration-200 group">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-teal-600 group-hover:text-orange-500 transition-colors flex-shrink-0" />
                            <span className="font-medium text-gray-800 group-hover:text-teal-700 transition-colors text-sm truncate">
                              {city.name}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            ))}
          </div>
        </section>

        {/* Back to home */}
        <section className="py-12 px-4 bg-slate-50 border-t">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-teal-700 font-semibold hover:text-orange-500 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>
        </section>

        <StickyFooterCTA city="" />
      </div>
    </AnalyticsProvider>
  );
}
