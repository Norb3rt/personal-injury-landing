"use client"

import dynamic from "next/dynamic"

const NationwideMap = dynamic(() => import("./nationwide-map").then(mod => mod.default), {
    ssr: false,
    loading: () => (
        <div className="h-[500px] w-full bg-slate-100 rounded-xl flex items-center justify-center animate-pulse border border-slate-200">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400 font-medium">Loading Interactive Map...</p>
            </div>
        </div>
    ),
})

export function NationwideMapWrapper(props: any) {
    return <NationwideMap {...props} />
}
