## **Objective**
Review, validate, and optimize the schema module for the project:

**https://personalinjury.lawproactive.com**

Ensure that:

The schema is properly structured

It complies with Schema.org standards

It meets Google Rich Results requirements

All programmatically generated pages receive the correct schema

There are no syntax errors

There are no broken URLs

There are no duplicated @id values

---

## **Code to review**



const BASE = "https://personalinjury.lawproactive.com";

export const CONFIG = {
  org: {
    name: "LawProactive",
    legalName: "LawProactive, Inc.",
    url: BASE,
    logo: `${BASE}/logo.png`,
    phone: "+1-213-394-5867",
    email: "lawproactive@gmail.com",
    address: {
      street: "4001 Inglewood Avenue, Suite 233",
      city: "Redondo Beach",
      state: "CA",
      zip: "90278",
    },
    social: [
      "https://www.facebook.com/profile.php?id=100093908101031",
      "https://www.linkedin.com/company/lawproactive",
      "https://twitter.com/lawproactive",
    ],
  },

  practiceAreas: [
    "Car Accident",
    "Slip and Fall",
    "Medical Malpractice",
    "Workplace Injuries",
    "Product Liability",
    "Wrongful Death",
  ],
};

// -----------------------------------------------------
// ORGANIZATION SCHEMA
// -----------------------------------------------------
export function orgSchema() {
  const { org } = CONFIG;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE}/#org`,
    name: org.name,
    legalName: org.legalName,
    url: org.url,
    logo: org.logo,
    telephone: org.phone,
    email: org.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: org.address.street,
      addressLocality: org.address.city,
      addressRegion: org.address.state,
      postalCode: org.address.zip,
      addressCountry: "US",
    },
    sameAs: org.social,
  };
}

// -----------------------------------------------------
// WEBSITE SCHEMA
// -----------------------------------------------------
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    url: BASE,
    name: CONFIG.org.name,
    publisher: { "@id": `${BASE}/#org` },
  };
}

// -----------------------------------------------------
// CITY PAGE SCHEMA (LegalService)
// -----------------------------------------------------
export function citySchema(city, state, stateCode, lat, lng) {
  const url = `${BASE}/personal-injury-lawyer/${state.toLowerCase()}/${city.toLowerCase()}`;

  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `${url}/#service`,
    name: `Personal Injury Lawyer ${city}, ${stateCode}`,
    url,
    description: `Connect with experienced personal injury lawyers in ${city}, ${stateCode}. Free consultation. We handle car accidents, slip and fall, medical malpractice, and more.`,
    telephone: CONFIG.org.phone,
    areaServed: {
      "@type": "City",
      name: city,
      containedInPlace: { "@type": "State", name: state },
    },
    provider: { "@id": `${BASE}/#org` },
  };
}

// -----------------------------------------------------
// DATASET SCHEMA (Accident Stats)
// -----------------------------------------------------
export function datasetSchema(city, state, stateCode, data) {
  const url = `${BASE}/personal-injury-lawyer/${state.toLowerCase()}/${city.toLowerCase()}`;

  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${url}/#dataset`,
    name: `${city}, ${stateCode} Accident Statistics`,
    description: `Live accident data for ${city}, ${stateCode} including top accident locations, freeways, and injury types from government sources.`,
    url,
    isPartOf: { "@id": url },
    spatialCoverage: {
      "@type": "City",
      name: city,
    },
    distribution: {
      "@type": "DataDownload",
      contentUrl: url,
      encodingFormat: "HTML",
    },
    keywords: [
      `${city} accidents`,
      `${state} injury statistics`,
      "accident data",
    ],
  };
}

// -----------------------------------------------------
// PRACTICE AREA SUB-PAGE SCHEMA
// -----------------------------------------------------
export function serviceSchema(city, state, stateCode, practiceArea) {
  const url = `${BASE}/personal-injury-lawyer/${state.toLowerCase()}/${city.toLowerCase()}/${practiceArea
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `${url}/#service`,
    name: `${practiceArea} Lawyer ${city}, ${stateCode}`,
    url,
    description: `${practiceArea} lawyer in ${city}, ${stateCode}. Free case review. No fee unless you win.`,
    telephone: CONFIG.org.phone,
    areaServed: {
      "@type": "City",
      name: city,
    },
    provider: { "@id": `${BASE}/#org` },
    isPartOf: {
      "@id": `${BASE}/personal-injury-lawyer/${state.toLowerCase()}/${city.toLowerCase()}/#service`,
    },
  };
}

// -----------------------------------------------------
// NEWS ARTICLE SCHEMA
// -----------------------------------------------------
export function newsArticleSchema(city, url, headline, description, datePublished) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline,
    description,
    url,
    datePublished,
    isPartOf: {
      "@id": `${BASE}/personal-injury-lawyer/${city.toLowerCase()}/#service`,
    },
  };
}
