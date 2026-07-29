/**
 * Practice Areas Configuration
 * Defines all practice areas for personal injury law
 * Used for generating subniche pages and navigation
 */

export interface PracticeArea {
  name: string
  slug: string
  icon: string
  description: string
  longDescription: string
  keywords: string[]
  commonInjuries: string[]
  faqItems: Array<{
    question: string
    answer: string
  }>
}

export const PRACTICE_AREAS: PracticeArea[] = [
  {
    name: "Car Accident",
    slug: "car-accident",
    icon: "🚗",
    description: "Get compensation for vehicle collisions and injuries",
    longDescription: "Car accidents can result in serious injuries, property damage, and financial hardship. We help accident victims pursue compensation for medical bills, lost wages, pain and suffering, and vehicle repairs. Whether you were hit by a distracted driver, rear-ended, or involved in a multi-vehicle collision, we understand the complexities of auto accident claims and are here to guide you through every step.",
    keywords: [
      "car accident lawyer",
      "auto accident attorney",
      "vehicle collision claim",
      "rear-end accident",
      "distracted driving accident",
      "drunk driving accident",
      "hit and run accident"
    ],
    commonInjuries: [
      "Whiplash and neck injuries",
      "Back and spinal cord injuries",
      "Traumatic brain injuries (TBI)",
      "Broken bones and fractures",
      "Internal injuries",
      "Soft tissue damage"
    ],
    faqItems: [
      {
        question: "What should I do immediately after a car accident?",
        answer: "First, ensure everyone's safety and call 911 if there are injuries. Document the scene with photos, exchange information with other drivers, and get contact details from witnesses. Seek medical attention even if you feel fine, as some injuries appear later. Contact an attorney before speaking with insurance adjusters."
      },
      {
        question: "How much is my car accident case worth?",
        answer: "The value depends on factors like injury severity, medical costs, lost wages, property damage, and pain and suffering. Our partner attorneys will evaluate your case for free and fight to maximize your compensation."
      },
      {
        question: "How long do I have to file a car accident claim?",
        answer: "The statute of limitations varies by state, typically ranging from 1-3 years. However, it's best to act quickly to preserve evidence and witness testimony. Contact an attorney as soon as possible after your accident."
      }
    ]
  },
  {
    name: "Slip & Fall",
    slug: "slip-and-fall",
    icon: "⚠️",
    description: "Property owner negligence claims",
    longDescription: "Property owners have a legal duty to maintain safe premises. If you've been injured due to hazardous conditions like wet floors, uneven surfaces, poor lighting, or inadequate maintenance, you may be entitled to compensation. Slip and fall cases require proving the property owner knew or should have known about the dangerous condition and failed to address it.",
    keywords: [
      "slip and fall lawyer",
      "premises liability attorney",
      "trip and fall accident",
      "property negligence claim",
      "wet floor accident",
      "uneven surface injury",
      "inadequate lighting accident"
    ],
    commonInjuries: [
      "Hip fractures",
      "Wrist and arm fractures",
      "Head injuries and concussions",
      "Spinal cord injuries",
      "Knee and ankle injuries",
      "Shoulder dislocations"
    ],
    faqItems: [
      {
        question: "What makes a property owner liable for my slip and fall?",
        answer: "Property owners are liable if they knew or should have known about a dangerous condition and failed to fix it or warn visitors. This includes wet floors, broken stairs, poor lighting, or debris in walkways."
      },
      {
        question: "Can I sue if I fell in a store or business?",
        answer: "Yes, businesses owe customers a duty of care to maintain safe premises. If negligence caused your fall, you can pursue compensation for medical bills, lost wages, and pain and suffering."
      },
      {
        question: "What evidence do I need for a slip and fall case?",
        answer: "Document the scene with photos, get witness statements, file an incident report with the property owner, keep all medical records, and preserve the shoes and clothing you wore. An attorney can help gather additional evidence."
      }
    ]
  },
  {
    name: "Medical Malpractice",
    slug: "medical-malpractice",
    icon: "🏥",
    description: "Healthcare provider negligence cases",
    longDescription: "When healthcare professionals fail to provide the standard of care expected in their field, resulting in patient harm, it constitutes medical malpractice. This includes misdiagnosis, surgical errors, medication mistakes, birth injuries, and failure to diagnose serious conditions. Medical malpractice cases are complex and require expert testimony to prove negligence.",
    keywords: [
      "medical malpractice lawyer",
      "doctor negligence attorney",
      "surgical error claim",
      "misdiagnosis lawsuit",
      "hospital negligence",
      "birth injury attorney",
      "medication error claim"
    ],
    commonInjuries: [
      "Permanent disability",
      "Organ damage",
      "Surgical complications",
      "Birth injuries",
      "Wrongful death",
      "Chronic pain and suffering"
    ],
    faqItems: [
      {
        question: "What qualifies as medical malpractice?",
        answer: "Medical malpractice occurs when a healthcare provider deviates from the accepted standard of care, causing patient harm. This includes misdiagnosis, surgical errors, medication mistakes, or failure to obtain informed consent."
      },
      {
        question: "How long do I have to file a medical malpractice claim?",
        answer: "Statutes of limitations vary by state, typically 1-3 years from when the malpractice occurred or was discovered. Some states have special rules for cases involving minors or delayed discovery."
      },
      {
        question: "Do I need a medical expert for my case?",
        answer: "Yes, medical malpractice cases require expert testimony to establish the standard of care and prove it was breached. Our partner attorneys work with qualified medical experts to build strong cases."
      }
    ]
  },
  {
    name: "Workplace Injuries",
    slug: "workplace-injury",
    icon: "🏗️",
    description: "On-the-job accident compensation",
    longDescription: "Workers injured on the job are typically covered by workers' compensation insurance, which provides medical benefits and wage replacement. However, in some cases, you may also have a personal injury claim against a third party, such as equipment manufacturers or contractors. Our attorneys can help you navigate both workers' comp claims and potential lawsuits to maximize your recovery.",
    keywords: [
      "workplace injury lawyer",
      "workers compensation attorney",
      "on the job accident",
      "construction accident lawyer",
      "industrial accident claim",
      "occupational injury attorney",
      "work-related injury"
    ],
    commonInjuries: [
      "Falls from heights",
      "Machinery accidents",
      "Repetitive stress injuries",
      "Chemical exposure",
      "Electrocution",
      "Crushing injuries"
    ],
    faqItems: [
      {
        question: "Can I sue my employer for a workplace injury?",
        answer: "Generally, workers' compensation is your exclusive remedy against your employer. However, you may be able to sue third parties like equipment manufacturers, contractors, or property owners if their negligence contributed to your injury."
      },
      {
        question: "What if my workers' comp claim is denied?",
        answer: "You have the right to appeal a denied claim. An experienced attorney can help you gather evidence, file appeals, and represent you at hearings to fight for the benefits you deserve."
      },
      {
        question: "How much compensation can I get for a workplace injury?",
        answer: "Workers' comp typically covers medical expenses and a portion of lost wages. If you have a third-party claim, you may also recover compensation for pain and suffering, full lost wages, and other damages not covered by workers' comp."
      }
    ]
  },
  {
    name: "Product Liability",
    slug: "product-liability",
    icon: "📦",
    description: "Defective product injury claims",
    longDescription: "Manufacturers, distributors, and retailers can be held liable when defective products cause injuries. Product liability claims can involve design defects, manufacturing defects, or failure to provide adequate warnings. Common cases include defective medical devices, dangerous pharmaceuticals, faulty auto parts, and unsafe consumer products.",
    keywords: [
      "product liability lawyer",
      "defective product attorney",
      "dangerous product claim",
      "product recall lawsuit",
      "manufacturing defect",
      "design defect claim",
      "failure to warn"
    ],
    commonInjuries: [
      "Burns and lacerations",
      "Poisoning or toxic exposure",
      "Electrocution",
      "Amputation",
      "Organ damage",
      "Death"
    ],
    faqItems: [
      {
        question: "Who can I sue for a defective product injury?",
        answer: "You may be able to sue the manufacturer, distributor, wholesaler, or retailer of the defective product. Product liability law allows you to hold any party in the distribution chain responsible for injuries caused by defective products."
      },
      {
        question: "What types of product defects lead to lawsuits?",
        answer: "There are three main types: design defects (inherently dangerous design), manufacturing defects (errors during production), and marketing defects (inadequate warnings or instructions)."
      },
      {
        question: "Do I need to prove the manufacturer was negligent?",
        answer: "Not necessarily. Product liability cases can be based on strict liability, meaning you only need to prove the product was defective and caused your injury, regardless of whether the manufacturer was negligent."
      }
    ]
  },
  {
    name: "Wrongful Death",
    slug: "wrongful-death",
    icon: "💔",
    description: "Justice for families who lost loved ones",
    longDescription: "When someone dies due to another party's negligence or wrongful act, surviving family members may file a wrongful death claim. These cases seek compensation for funeral expenses, lost financial support, loss of companionship, and the pain and suffering of survivors. Wrongful death claims can arise from car accidents, medical malpractice, workplace accidents, defective products, and other forms of negligence.",
    keywords: [
      "wrongful death lawyer",
      "wrongful death attorney",
      "fatal accident claim",
      "death by negligence",
      "survivor benefits",
      "wrongful death lawsuit",
      "fatal injury claim"
    ],
    commonInjuries: [
      "Fatal car accidents",
      "Medical malpractice deaths",
      "Workplace fatalities",
      "Nursing home abuse deaths",
      "Defective product deaths",
      "Pedestrian fatalities"
    ],
    faqItems: [
      {
        question: "Who can file a wrongful death claim?",
        answer: "Typically, immediate family members such as spouses, children, or parents of unmarried children can file wrongful death claims. Some states also allow life partners, financial dependents, or distant family members to file under certain circumstances."
      },
      {
        question: "What damages can be recovered in a wrongful death case?",
        answer: "Damages may include funeral and burial expenses, medical bills before death, lost income and benefits, loss of companionship and support, and pain and suffering of survivors. Some states also allow punitive damages in cases of gross negligence."
      },
      {
        question: "How long do I have to file a wrongful death claim?",
        answer: "The statute of limitations varies by state, typically 1-3 years from the date of death. It's crucial to consult with an attorney promptly to preserve your rights and ensure evidence is not lost."
      }
    ]
  }
]

/**
 * Get practice area by slug (Sync - fallback to static)
 */
export function getPracticeAreaBySlug(slug: string): PracticeArea | undefined {
  return PRACTICE_AREAS.find(area => area.slug === slug)
}

/**
 * Get all practice area slugs
 */
export function getAllPracticeAreaSlugs(): string[] {
  return PRACTICE_AREAS.map(area => area.slug)
}

/**
 * Convert practice area name to slug
 */
export function practiceAreaNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+&\s+/g, '-and-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}


