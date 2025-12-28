/**
 * State-specific legal information for personal injury cases.
 * This data helps make programmatic pages unique and valuable.
 */

export interface StateLawInfo {
    stateName: string
    stateSlug: string
    statuteOfLimitations: string
    faultSystem: string
    minInsurance: string
    keyFacts: string[]
}

export const stateLaws: Record<string, StateLawInfo> = {
    "california": {
        stateName: "California",
        stateSlug: "california",
        statuteOfLimitations: "2 years from the date of injury",
        faultSystem: "Pure Comparative Fault",
        minInsurance: "$15,000/$30,000/$5,000",
        keyFacts: [
            "California follows pure comparative negligence, meaning you can recover damages even if you're 99% at fault.",
            "The state requires all drivers to carry minimum liability insurance.",
            "California has no cap on non-economic damages in most personal injury cases.",
            "You have 2 years to file a lawsuit after an accident."
        ]
    },
    "texas": {
        stateName: "Texas",
        stateSlug: "texas",
        statuteOfLimitations: "2 years from the date of injury",
        faultSystem: "Modified Comparative Fault (51% Bar)",
        minInsurance: "$30,000/$60,000/$25,000",
        keyFacts: [
            "Texas uses a 51% bar rule—if you're more than 50% at fault, you cannot recover damages.",
            "The state has caps on non-economic damages in medical malpractice cases.",
            "Texas requires proof of fault to recover in personal injury cases.",
            "Punitive damages are capped at the greater of $200,000 or twice economic damages plus $750,000."
        ]
    },
    "florida": {
        stateName: "Florida",
        stateSlug: "florida",
        statuteOfLimitations: "4 years from the date of injury (2 years for negligence as of 2023)",
        faultSystem: "Modified Comparative Fault (51% Bar, as of 2023)",
        minInsurance: "$10,000/$20,000/$10,000",
        keyFacts: [
            "Florida recently changed from pure comparative to modified comparative negligence.",
            "The statute of limitations for negligence was reduced from 4 to 2 years in 2023.",
            "Florida is a no-fault state for car insurance, meaning PIP coverage is required.",
            "There are no caps on compensatory damages in most personal injury cases."
        ]
    },
    "new-york": {
        stateName: "New York",
        stateSlug: "new-york",
        statuteOfLimitations: "3 years from the date of injury",
        faultSystem: "Pure Comparative Fault",
        minInsurance: "$25,000/$50,000/$10,000",
        keyFacts: [
            "New York follows pure comparative negligence, allowing recovery regardless of your fault percentage.",
            "It's a no-fault insurance state with mandatory Personal Injury Protection (PIP).",
            "To sue for pain and suffering after a car accident, you must meet the 'serious injury' threshold.",
            "There are no caps on damages in personal injury lawsuits."
        ]
    },
    "arizona": {
        stateName: "Arizona",
        stateSlug: "arizona",
        statuteOfLimitations: "2 years from the date of injury",
        faultSystem: "Pure Comparative Fault",
        minInsurance: "$25,000/$50,000/$15,000",
        keyFacts: [
            "Arizona follows pure comparative negligence, meaning you can recover damages even if mostly at fault.",
            "The state does not cap compensatory or punitive damages.",
            "Arizona requires drivers to carry minimum liability insurance.",
            "There is a 2-year deadline to file most personal injury lawsuits."
        ]
    }
}

/**
 * Get legal information for a given state.
 * Returns a default object if the state is not in our database.
 */
export function getStateLawInfo(stateSlug: string): StateLawInfo {
    const info = stateLaws[stateSlug.toLowerCase()]

    if (info) {
        return info
    }

    // Default fallback for states not explicitly defined
    const stateName = stateSlug
        .replace(/-/g, " ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")

    return {
        stateName,
        stateSlug,
        statuteOfLimitations: "Varies by case type (typically 2-3 years)",
        faultSystem: "Varies by state law",
        minInsurance: "State minimum required",
        keyFacts: [
            `${stateName} has specific laws governing personal injury claims that an experienced local attorney can explain.`,
            "Time limits to file a lawsuit vary, so it's important to act quickly.",
            "Insurance requirements and fault rules affect how claims are handled.",
            "A local attorney will understand the specific rules that apply to your case."
        ]
    }
}
