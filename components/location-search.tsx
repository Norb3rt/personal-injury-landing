"use client"

import * as React from "react"
import { Check, ChevronsUpDown, MapPin, Search } from "lucide-react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

// This would ideally come from an API or the StateDataLoader, but for client-side search
// we can start with a curated list of major cities and states.
// In a real app, this would be an async search against an API endpoint.
const locations = [
    { value: "california/los-angeles", label: "Los Angeles, CA" },
    { value: "california/san-francisco", label: "San Francisco, CA" },
    { value: "california/san-diego", label: "San Diego, CA" },
    { value: "california/sacramento", label: "Sacramento, CA" },
    { value: "texas/houston", label: "Houston, TX" },
    { value: "texas/dallas", label: "Dallas, TX" },
    { value: "texas/austin", label: "Austin, TX" },
    { value: "texas/san-antonio", label: "San Antonio, TX" },
    { value: "florida/miami", label: "Miami, FL" },
    { value: "florida/orlando", label: "Orlando, FL" },
    { value: "florida/tampa", label: "Tampa, FL" },
    { value: "florida/jacksonville", label: "Jacksonville, FL" },
    { value: "new-york/new-york-city", label: "New York City, NY" },
    { value: "new-york/buffalo", label: "Buffalo, NY" },
    { value: "illinois/chicago", label: "Chicago, IL" },
    { value: "pennsylvania/philadelphia", label: "Philadelphia, PA" },
    { value: "arizona/phoenix", label: "Phoenix, AZ" },
    { value: "nevada/las-vegas", label: "Las Vegas, NV" },
    { value: "washington/seattle", label: "Seattle, WA" },
    { value: "massachusetts/boston", label: "Boston, MA" },
    { value: "georgia/atlanta", label: "Atlanta, GA" },
    { value: "colorado/denver", label: "Denver, CO" },
]

export function LocationSearch({ className }: { className?: string }) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const router = useRouter()

    const handleSelect = (currentValue: string) => {
        setValue(currentValue === value ? "" : currentValue)
        setOpen(false)

        if (currentValue) {
            // Redirect to the selected city page
            router.push(`/personal-injury-lawyer/${currentValue}`)
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full max-w-md justify-between h-12 text-base shadow-lg border-0 bg-white/95 backdrop-blur text-gray-900", className)}
                >
                    <div className="flex items-center gap-2 truncate">
                        <Search className="h-4 w-4 opacity-50" />
                        {value
                            ? locations.find((location) => location.value === value)?.label
                            : "Search for your city (e.g. Miami, Los Angeles)..."}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 max-h-[300px]" align="start">
                <Command>
                    <CommandInput placeholder="Search city or state..." />
                    <CommandList>
                        <CommandEmpty>No location found.</CommandEmpty>
                        <CommandGroup heading="Popular Locations">
                            {locations.map((location) => (
                                <CommandItem
                                    key={location.value}
                                    value={location.label} // Search by label
                                    onSelect={() => handleSelect(location.value)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === location.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                                    {location.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
