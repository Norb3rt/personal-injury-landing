import { supabaseServer } from '@/lib/supabase-server';
import { StateDataLoader } from '@/lib/data/state-loader';

// Types definition for programmatic SEO content sections
export interface PageContent {
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  hero: {
    h1: string;
    subtitle: string;
    ctaText: string;
    icon?: string;
  };
  about?: {
    title?: string;
    longDescription?: string;
    commonInjuriesTitle?: string;
    commonInjuries?: string[];
    ctaText?: string;
  };
  meta?: {
    name?: string;
    description?: string;
    keywords?: string[];
  };
  whyChoose?: {
    title?: string;
    items?: Array<{
      title: string;
      desc: string;
    }>;
  };
  services: {
    title: string;
    items: Array<{
      name: string;
      slug: string;
      icon: string;
      description: string;
    }>;
  };
  painPoints: {
    title: string;
    ctaText: string;
    items: string[];
  };
  valueProp: {
    title: string;
    subtitle: string;
    ctaText: string;
    stats: Array<{
      value: number;
      suffix: string;
      label: string;
      desc: string;
    }>;
  };
  howItWorks: {
    title: string;
    ctaText: string;
    steps: Array<{
      title: string;
      desc: string;
    }>;
  };
  riskReversal: {
    title: string;
    desc: string;
    disclaimer: string;
    ctaText: string;
  };
  testimonials: {
    title: string;
    ctaText: string;
    items: Array<{
      name: string;
      location: string;
      case: string;
      settlement: string;
      quote: string;
      rating: number;
    }>;
  };
  reassurance: {
    title: string;
    desc: string;
    ctaText: string;
  };
  faq: {
    title: string;
    ctaText: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
}

// Function to recursively replace {city}, {state}, {population}, and {landmark} tokens in JSON configurations
export function replaceTokensInObject(
  obj: any,
  city: string,
  state: string,
  population?: string | null,
  landmark?: string | null,
  practiceName?: string | null
): any {
  if (typeof obj === 'string') {
    let text = obj.replace(/{city}/g, city).replace(/{state}/g, state);
    if (population) {
      text = text.replace(/{population}/g, population);
    } else {
      text = text.replace(/{population}/g, 'many');
    }
    text = text.replace(/{landmark}/g, landmark || 'me');
    if (practiceName) {
      text = text.replace(/{practiceName}/g, practiceName).replace(/{practice}/g, practiceName);
    }
    return text;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => replaceTokensInObject(item, city, state, population, landmark, practiceName));
  }
  if (typeof obj === 'object' && obj !== null) {
    const result: any = {};
    for (const key in obj) {
      result[key] = replaceTokensInObject(obj[key], city, state, population, landmark, practiceName);
    }
    return result;
  }
  return obj;
}

// Deep merging helper that merges arrays index-by-index and maps object keys
export function deepMerge(target: any, source: any): any {
  // If target is an array and source is an array
  if (Array.isArray(target) && Array.isArray(source)) {
    if (source.length === 0) return target;
    // If array of primitives (strings, numbers), the source array overrides the target array
    if (source.every(item => typeof item !== 'object' || item === null)) {
      return source;
    }
    // If array of objects (like FAQ or whyChoose items), merge index-by-index
    const maxLen = Math.max(target.length, source.length);
    const result = [];
    for (let idx = 0; idx < maxLen; idx++) {
      const targetItem = target[idx];
      const sourceItem = source[idx];
      if (sourceItem !== undefined && sourceItem !== null && sourceItem !== "") {
        if (targetItem !== undefined && typeof targetItem === 'object' && targetItem !== null && typeof sourceItem === 'object') {
          result.push(deepMerge(targetItem, sourceItem));
        } else {
          result.push(sourceItem);
        }
      } else if (targetItem !== undefined) {
        result.push(targetItem);
      }
    }
    return result;
  }

  // If they are objects, merge their keys recursively
  if (typeof target === 'object' && target !== null && typeof source === 'object' && source !== null) {
    const output = { ...target };
    for (const key in source) {
      const sourceVal = source[key];
      const targetVal = target[key];

      if (sourceVal === null || sourceVal === undefined || sourceVal === "") {
        continue;
      }

      if (key in target) {
        output[key] = deepMerge(targetVal, sourceVal);
      } else {
        output[key] = sourceVal;
      }
    }
    return output;
  }

  // Scalar values
  if (source !== null && source !== undefined && source !== "") {
    return source;
  }
  return target;
}

// Fetch the base template from Supabase
export async function getBaseTemplate(pageKey: string = 'default'): Promise<any> {
  try {
    const { data, error } = await supabaseServer
      .from('page_config_templates')
      .select('sections')
      .eq('page_key', pageKey)
      .maybeSingle();

    if (error || !data || !data.sections) {
      return null;
    }
    return data.sections;
  } catch (err) {
    console.error('Error fetching base template:', err);
    return null;
  }
}

// Main function: Fetches and merges page content in order of hierarchy:
// 1. Global Default Template
// 2. State-Level Customization Override (e.g. state = california, city = null)
// 3. City-Level Customization Override (e.g. state = california, city = los-angeles)
export async function getMergedPageConfig(
  stateSlug: string,
  citySlug: string,
  practiceSlug: string | null = null,
  population: string | null = null,
  landmark: string | null = null
): Promise<PageContent> {
  // Auto-resolve population and landmark internally if not provided by caller
  let resolvedPopulation = population;
  let resolvedLandmark = landmark;

  if (!resolvedPopulation || !resolvedLandmark) {
    try {
      const cityLocation = await StateDataLoader.findLocation(stateSlug, citySlug);
      if (cityLocation) {
        if (!resolvedPopulation && cityLocation.population) {
          resolvedPopulation = new Intl.NumberFormat('en-US').format(cityLocation.population);
        }
        if (!resolvedLandmark && cityLocation.landmark) {
          resolvedLandmark = cityLocation.landmark;
        }
      }
    } catch (e) {
      console.error('Error auto-resolving location tokens:', e);
    }
  }

  // 1. Convert slugs to title casing for rendering
  const toTitleCase = (slug: string) => 
    slug.replace(/-/g, " ").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");

  const city = toTitleCase(citySlug);
  const stateConfig = await StateDataLoader.getStateConfig(stateSlug).catch(() => null);
  const state = stateConfig?.name || toTitleCase(stateSlug);

  // 2. Fetch the global template config
  const pageKey = practiceSlug || 'default';
  const baseSections = await getBaseTemplate(pageKey);
  const fallback = getHardcodedFallbackConfig();
  let mergedSections = baseSections ? deepMerge(fallback, baseSections) : fallback;

  try {
    // 3. Query State-Level General Override (where city_slug and practice_slug are null)
    const { data: stateGeneralOverride } = await supabaseServer
      .from('location_page_configs')
      .select('sections')
      .eq('state_slug', stateSlug)
      .is('city_slug', null)
      .is('practice_slug', null)
      .maybeSingle();

    if (stateGeneralOverride && stateGeneralOverride.sections) {
      mergedSections = deepMerge(mergedSections, stateGeneralOverride.sections);
    }

    // 4. Query State-Level Practice Override (where city_slug is null, matching practice_slug)
    if (practiceSlug) {
      const { data: statePracticeOverride } = await supabaseServer
        .from('location_page_configs')
        .select('sections')
        .eq('state_slug', stateSlug)
        .is('city_slug', null)
        .eq('practice_slug', practiceSlug)
        .maybeSingle();

      if (statePracticeOverride && statePracticeOverride.sections) {
        mergedSections = deepMerge(mergedSections, statePracticeOverride.sections);
      }
    }

    // 5. Query City-Level General Override (specific state and city, practice_slug null)
    const { data: cityGeneralOverride } = await supabaseServer
      .from('location_page_configs')
      .select('sections')
      .eq('state_slug', stateSlug)
      .eq('city_slug', citySlug)
      .is('practice_slug', null)
      .maybeSingle();

    if (cityGeneralOverride && cityGeneralOverride.sections) {
      mergedSections = deepMerge(mergedSections, cityGeneralOverride.sections);
    }

    // 6. Query City-Level Practice Override (specific state, city, and matching practice_slug)
    if (practiceSlug) {
      const { data: cityPracticeOverride } = await supabaseServer
        .from('location_page_configs')
        .select('sections')
        .eq('state_slug', stateSlug)
        .eq('city_slug', citySlug)
        .eq('practice_slug', practiceSlug)
        .maybeSingle();

      if (cityPracticeOverride && cityPracticeOverride.sections) {
        mergedSections = deepMerge(mergedSections, cityPracticeOverride.sections);
      }
    }
  } catch (err) {
    console.error('Error fetching location overrides from Supabase:', err);
  }

  // 7. Replace {city}, {state}, {population}, {landmark}, and {practiceName} recursively in the final merged object
  const resolvedPracticeName = mergedSections?.meta?.name || (practiceSlug ? toTitleCase(practiceSlug) : '');
  return replaceTokensInObject(mergedSections, city, state, resolvedPopulation, resolvedLandmark, resolvedPracticeName) as PageContent;
}

// Fetch the raw configuration for the dashboard (keeps placeholders intact)
export async function getRawPageConfig(
  stateSlug: string | null,
  citySlug: string | null,
  practiceSlug: string | null = null
): Promise<any> {
  const pageKey = practiceSlug || 'default';
  const baseSections = await getBaseTemplate(pageKey);
  const fallback = pageKey === 'homepage' ? getHardcodedHomepageConfig() : getHardcodedFallbackConfig();
  let mergedSections = baseSections ? deepMerge(fallback, baseSections) : fallback;

  try {
    if (stateSlug) {
      // 1. Merge State-Level Override
      let stateQuery = supabaseServer
        .from('location_page_configs')
        .select('sections')
        .eq('state_slug', stateSlug)
        .is('city_slug', null);

      if (practiceSlug) {
        stateQuery = stateQuery.eq('practice_slug', practiceSlug);
      } else {
        stateQuery = stateQuery.is('practice_slug', null);
      }

      const { data: stateOverride } = await stateQuery.maybeSingle();

      if (stateOverride && stateOverride.sections) {
        mergedSections = deepMerge(mergedSections, stateOverride.sections);
      }

      if (citySlug) {
        // 2. Merge City-Level Override
        let cityQuery = supabaseServer
          .from('location_page_configs')
          .select('sections')
          .eq('state_slug', stateSlug)
          .eq('city_slug', citySlug);

        if (practiceSlug) {
          cityQuery = cityQuery.eq('practice_slug', practiceSlug);
        } else {
          cityQuery = cityQuery.is('practice_slug', null);
        }

        const { data: cityOverride } = await cityQuery.maybeSingle();

        if (cityOverride && cityOverride.sections) {
          mergedSections = deepMerge(mergedSections, cityOverride.sections);
        }
      }
    }
  } catch (err) {
    console.error('Error fetching raw page configs for admin dashboard:', err);
  }

  return mergedSections;
}

// Fetch the main root homepage configuration from Supabase or fallback to copy
export async function getHomepageConfig(): Promise<PageContent> {
  const sections = await getBaseTemplate('homepage');
  const fallback = getHardcodedHomepageConfig();
  return sections ? deepMerge(fallback, sections) : fallback;
}

// Hardcoded homepage configuration default copywriting
export function getHardcodedHomepageConfig() {
  return {
    seo: {
      metaTitle: "Personal Injury Lawyers | Nationwide Legal Help | Free Consultation",
      metaDescription: "Connect with top personal injury attorneys across the USA. No win, no fee. Get the settlement you deserve. Find a lawyer near you today."
    },
    hero: {
      h1: "Injured in an Accident? Get the Settlement You Deserve.",
      subtitle: "Connect with top personal injury attorneys across the nation. No recovery, no fee. Available 24/7 to help you fight for your rights.",
      ctaText: "Get a Free Case Review"
    },
    services: {
      title: "Our Practice Areas",
      items: [
        { name: "Car Accidents", slug: "car-accident", icon: "🚗", description: "Get compensation for vehicle collisions and injuries" },
        { name: "Slip & Fall", slug: "slip-and-fall", icon: "⚠️", description: "Property owner negligence claims" },
        { name: "Medical Malpractice", slug: "medical-malpractice", icon: "🏥", description: "Healthcare provider negligence cases" },
        { name: "Workplace Injuries", slug: "workplace-injury", icon: "🏗️", description: "On-the-job accident compensation" },
        { name: "Product Liability", slug: "product-liability", icon: "📦", description: "Defective product injury claims" },
        { name: "Wrongful Death", slug: "wrongful-death", icon: "💔", description: "Justice for families who lost loved ones" }
      ]
    },
    painPoints: {
      title: "Insurance Companies Hope You'll Settle for Less.",
      ctaText: "Don't Let Them Win - Get Help Now",
      items: [
        "Medical bills stacking up?",
        "Missed work and lost paychecks?",
        "Emotional stress on top of physical pain?",
        "Insurance adjusters pushing low offers?"
      ]
    },
    valueProp: {
      title: "We Make It Simple to Find the Right Personal Injury Lawyer.",
      subtitle: "Connect with personal injury lawyers serving all 50 states. No attorney's fee unless your case results in a recovery. Court costs and case expenses may apply.",
      ctaText: "Find Out What Your Case is Worth",
      stats: [
        { value: 95, suffix: "%", label: "Of Injury Cases Settle Out of Court", desc: "Most injury claims are resolved through negotiation rather than a courtroom trial." },
        { value: 73, suffix: "%", label: "Accept the First Insurance Offer", desc: "First offers are often 40 to 60% lower than a claim's full value." },
        { value: 72, suffix: " Hours", label: "Critical Window to Preserve Evidence", desc: "Surveillance footage, witness statements, and scene details can disappear within days." }
      ]
    },
    howItWorks: {
      title: "Only Three Steps to Your Peace of Mind.",
      ctaText: "Start Step 1 Now",
      steps: [
        { title: "Tell Us About Your Accident", desc: "Free, no-obligation case evaluation." },
        { title: "Connect with a local attorney", desc: "Quickly connect with a local personal injury lawyer." },
        { title: "Resolve Your Claim", desc: "No attorney's fee unless there's a recovery. Court costs and case expenses may apply." }
      ]
    },
    riskReversal: {
      title: "No Recovery, No Attorney's Fee.",
      desc: "There's no upfront attorney's fee. Participating attorneys are paid only from any recovery obtained in your case.",
      disclaimer: "*No attorney's fee unless there is a recovery. The client may be responsible for court costs and case expenses.",
      ctaText: "Free Case Review"
    },
    testimonials: {
      title: "What People Are Saying",
      ctaText: "Get Your Success Story Started",
      items: [
        { name: "Sarah M.", location: "California", case: "Beta", settlement: "Tester", quote: "I didn't know where to start after my accident, but this site helped me get in touch with a lawyer who could help.", rating: 5 },
        { name: "Michael R.", location: "Texas", case: "Beta", settlement: "Tester", quote: "The process was fast and simple. I got a free consultation the same day I submitted my info.", rating: 5 },
        { name: "Jennifer L.", location: "Florida", case: "Beta", settlement: "Tester", quote: "Highly recommended. Connected me with a local attorney who really fought for me.", rating: 5 }
      ]
    },
    reassurance: {
      title: "Still Weighing Your Options?",
      desc: "If you're not ready yet, that's perfectly fine. Explore your options, and when you're ready to take action, we'll be here — prepared to fight for your full compensation.",
      ctaText: "Get Your Free Case Review When Ready"
    },
    faq: {
      title: "Frequently Asked Questions",
      ctaText: "Still Have Questions? Get Answers Now",
      items: [
        { question: "How much does it cost to hire a personal injury lawyer?", answer: "Nothing upfront. Our partner attorneys work on a contingency fee basis, meaning they only get paid when they win your case. You'll never pay out of pocket." },
        { question: "How long will my case take?", answer: "It depends on the specifics of your case, but your attorney will aim to settle quickly and fairly. Most cases resolve within 6-18 months." },
        { question: "What types of compensation can I receive?", answer: "You may be entitled to medical expenses, lost wages, pain and suffering, property damage, and in some cases, punitive damages." },
        { question: "How quickly should I contact an attorney?", answer: "The sooner the better. Evidence can disappear, witnesses' memories fade, and there are legal deadlines (statutes of limitations) that must be met." }
      ]
    }
  };
}

// Fallback configuration in case the DB is empty or fails (Matching exact original copywriting)
export function getHardcodedFallbackConfig() {
  return {
    seo: {
      metaTitle: "{city} Personal Injury Lawyer | {state} | Free Consultation",
      metaDescription: "Injured in {city}? Get the settlement you deserve. Connect with top-rated personal injury attorneys in {city}, {state}. Free case evaluation. No win, no fee."
    },
    hero: {
      h1: "Injured in {city}? Get the Settlement You Deserve.",
      subtitle: "Your Search for a Personal Injury Attorney in {city} Ends Here. We provide legal support for accident claims, injuries, and more — proudly serving the {population} residents of {city}.",
      ctaText: "Get a Free Case Review",
      icon: ""
    },
    about: {
      title: "About {practiceName} Cases in {city}",
      longDescription: "",
      commonInjuriesTitle: "Common Injuries in {practiceName} Cases",
      commonInjuries: [],
      ctaText: "Discuss Your Case"
    },
    meta: {
      name: "",
      description: "",
      keywords: []
    },
    whyChoose: {
      title: "Why Choose Our Attorneys in {city}",
      items: [
        {
          title: "Proven Track Record",
          desc: "We bring experience and dedication to every case we handle, fighting to pursue the compensation our clients deserve."
        },
        {
          title: "Personalized Attention",
          desc: "Every case is unique. Our attorneys provide personalized strategies tailored to your specific situation."
        },
        {
          title: "No Upfront Costs",
          desc: "We work on a contingency fee basis — no attorney's fees unless we recover compensation for your case."
        }
      ]
    },
    services: {
      title: "Personal Injury Services in {city}",
      items: [
        { name: "Car Accidents", slug: "car-accident", icon: "🚗", description: "Get compensation for vehicle collisions and injuries" },
        { name: "Slip & Fall", slug: "slip-and-fall", icon: "⚠️", description: "Property owner negligence claims" },
        { name: "Medical Malpractice", slug: "medical-malpractice", icon: "🏥", description: "Healthcare provider negligence cases" },
        { name: "Workplace Injuries", slug: "workplace-injury", icon: "🏗️", description: "On-the-job accident compensation" },
        { name: "Product Liability", slug: "product-liability", icon: "📦", description: "Defective product injury claims" },
        { name: "Wrongful Death", slug: "wrongful-death", icon: "💔", description: "Justice for families who lost loved ones" }
      ]
    },
    painPoints: {
      title: "Insurance Companies Hope You'll Settle for Less.",
      ctaText: "Don't Let Them Win - Get Help Now",
      items: [
        "Medical bills stacking up?",
        "Missed work and lost paychecks?",
        "Emotional stress on top of physical pain?",
        "Insurance adjusters pushing low offers?"
      ]
    },
    valueProp: {
      title: "We Make It Simple to Find the Right Personal Injury Lawyer.",
      subtitle: "Connect with personal injury lawyers serving {city}. No attorney's fee unless your case results in a recovery. Court costs and case expenses may apply.",
      ctaText: "Find Out What Your Case is Worth",
      stats: [
        { value: 95, suffix: "%", label: "Of Injury Cases Settle Out of Court", desc: "Most injury claims are resolved through negotiation rather than a courtroom trial." },
        { value: 73, suffix: "%", label: "Accept the First Insurance Offer", desc: "First offers are often 40 to 60% lower than a claim's full value." },
        { value: 72, suffix: " Hours", label: "Critical Window to Preserve Evidence", desc: "Surveillance footage, witness statements, and scene details can disappear within days." }
      ]
    },
    howItWorks: {
      title: "Only Three Steps to Your Peace of Mind.",
      ctaText: "Start Step 1 Now",
      steps: [
        { title: "Tell Us About Your Accident", desc: "Free, no-obligation case evaluation." },
        { title: "Connect with a local attorney", desc: "Quickly connect with a local personal injury lawyer." },
        { title: "Resolve Your Claim", desc: "No attorney's fee unless there's a recovery. Court costs and case expenses may apply." }
      ]
    },
    riskReversal: {
      title: "No Recovery, No Attorney's Fee.",
      desc: "There's no upfront attorney's fee. Participating attorneys are paid only from any recovery obtained in your case.",
      disclaimer: "*No attorney's fee unless there is a recovery. The client may be responsible for court costs and case expenses.",
      ctaText: "Free Case Review"
    },
    testimonials: {
      title: "What People Are Saying",
      ctaText: "Get Your Success Story Started",
      items: [
        { name: "", location: "{city}, {state}", case: "Beta", settlement: "Tester", quote: "This platform made it easy to find a personal injury lawyer near {landmark}. I was contacted within minutes.", rating: 5 },
        { name: "", location: "{city}, {state}", case: "Beta", settlement: "Tester", quote: "I didn't know where to start after my accident, but this site helped me get in touch with a lawyer who could help", rating: 5 },
        { name: "", location: "{city}, {state}", case: "Beta", settlement: "Tester", quote: "The process was fast and simple. I got a free consultation the same day I submitted my info.", rating: 5 }
      ]
    },
    reassurance: {
      title: "Still Weighing Your Options?",
      desc: "If you're not ready yet, that's perfectly fine. Explore your options, and when you're ready to take action, we'll be here — prepared to fight for your full compensation.",
      ctaText: "Get Your Free Case Review When Ready"
    },
    faq: {
      title: "Frequently Asked Questions",
      ctaText: "Still Have Questions? Get Answers Now",
      items: [
        { question: "How much does it cost to hire a personal injury lawyer in {city}?", answer: "Nothing upfront. Our partner attorneys work on a contingency fee basis, meaning they only get paid when they win your case. You'll never pay out of pocket." },
        { question: "How long will my case take?", answer: "It depends on the specifics of your case, but your attorney will aim to settle quickly and fairly. Most cases resolve within 6-18 months, though complex cases may take longer." },
        { question: "What if I already got an insurance offer?", answer: "That initial offer is often much lower than what you deserve. An experienced attorney can negotiate for significantly more compensation based on the true value of your injuries and damages." },
        { question: "What types of compensation can I receive?", answer: "You may be entitled to medical expenses, lost wages, pain and suffering, property damage, and in some cases, punitive damages." },
        { question: "How quickly should I contact an attorney after my accident?", answer: "The sooner the better. Evidence can disappear, witnesses' memories fade, and there are legal deadlines (statutes of limitations) that must be met." }
      ]
    }
  };
}
