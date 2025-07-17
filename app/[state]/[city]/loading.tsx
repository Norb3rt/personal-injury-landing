import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Skeleton className="h-16 w-3/4 mx-auto mb-6 bg-white/20" />
          <Skeleton className="h-8 w-full max-w-4xl mx-auto mb-8 bg-white/20" />
          <Skeleton className="h-12 w-48 mx-auto mb-8 bg-white/20" />
          <div className="flex justify-center gap-6">
            <Skeleton className="h-6 w-32 bg-white/20" />
            <Skeleton className="h-6 w-32 bg-white/20" />
            <Skeleton className="h-6 w-32 bg-white/20" />
          </div>
        </div>
      </section>

      {/* Services Section Skeleton */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-12 w-96 mx-auto mb-12" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <Skeleton className="h-16 w-16 mx-auto mb-4" />
                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections Skeleton */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-80 mx-auto mb-8" />
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-8" />
          <Skeleton className="h-12 w-48 mx-auto" />
        </div>
      </section>
    </div>
  )
}
