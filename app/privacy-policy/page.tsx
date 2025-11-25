import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | LawProactive',
  description: 'Privacy Policy for LawProactive - Learn how we collect, use, and protect your personal information.',
  robots: 'index, follow',
  alternates: {
    canonical: '/privacy-policy',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg p-8 border-0">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#0B6B65' }}>Privacy Policy</h1>
            <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: '#e06e00' }}></div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              <strong>Effective Date:</strong> July 29, 2025
            </p>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>LawProactive Privacy Policy</h2>
              <p className="text-slate-700 leading-relaxed">
                This Privacy Policy explains how LawProactive.com ("LawProactive," "we," or "our") collects, uses, discloses,
                and protects your personal information when you use our website, request legal document preparation, or
                browse attorney listings.
              </p>
              <p className="text-slate-700 leading-relaxed">
                LawProactive is not a law firm and does not provide legal advice or representation.
                We are a California-registered and bonded Legal Document Assistant (LDA) platform operating under Business &
                Professions Code §§ 6400-6415. We also operate a publishing and advertising platform that enables
                attorneys to rent landing pages and maintain directory listings.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>What This Privacy Policy Covers</h2>
              <p className="text-slate-700 leading-relaxed mb-4">This Privacy Policy applies to:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Legal document preparation services offered by Law Proactive</li>
                <li>Our website and subdomains (including legal document automation portals)</li>
                <li>Directory listings and landing pages rented by attorneys for advertising purposes</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mb-4">This policy does NOT cover:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>The privacy practices of attorneys advertising on our platform</li>
                <li>Third-party websites linked from our site</li>
                <li>Legal services you may receive from attorneys independently</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>Our Approach to Privacy</h2>
              <p className="text-slate-700 leading-relaxed">
                We are committed to safeguarding the personal information you provide. We do not sell your data. We collect only the information necessary to deliver our services, support your interactions with the platform, and comply with applicable laws.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>Information We Collect</h2>
              <p className="text-slate-700 leading-relaxed mb-4">We may collect the following categories of personal information:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Identifiers</li>
                <li>Document Information</li>
                <li>Device & Usage Data</li>
                <li>Geolocation</li>
                <li>Professional Information</li>
                <li>Payment Information</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                We do NOT knowingly collect sensitive biometric, health, or protected class data.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>How We Collect Your Information</h2>
              <p className="text-slate-700 leading-relaxed mb-4">We collect information:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Directly from you via forms, email, or uploads</li>
                <li>Through your interactions with our site (via cookies or session tracking)</li>
                <li>From attorneys you contact through a listing or landing page</li>
                <li>From publicly available sources</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>How We Use Your Information</h2>
              <p className="text-slate-700 leading-relaxed mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Provide document preparation services under your direction</li>
                <li>Deliver legal forms or facilitate communication with independent attorneys</li>
                <li>Manage your account or user profile</li>
                <li>Improve our site and services</li>
                <li>Send communications</li>
                <li>Comply with regulations</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                We do NOT use your information to offer legal advice or legal representation.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>Attorney Listings and Advertising</h2>
              <p className="text-slate-700 leading-relaxed">
                Attorneys may rent landing pages or claim directory profiles to advertise their services. These pages are marked as "Attorney Advertising."
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">LawProactive does not:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Recommend, refer, or evaluate attorneys</li>
                <li>Create attorney-client relationships</li>
                <li>Guarantee legal services, outcomes, or qualifications</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>How We Share Information</h2>
              <p className="text-slate-700 leading-relaxed mb-4">We may share your information with:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Service providers</li>
                <li>Attorneys (only when you initiate contact)</li>
                <li>Regulatory authorities when required</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                We do not sell or license your personal information.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>Data Security</h2>
              <p className="text-slate-700 leading-relaxed">
                We use administrative, technical, and physical safeguards to protect your information. However, no system is fully secure. Please avoid submitting sensitive or confidential information.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>User Rights & Your Choices</h2>
              <p className="text-slate-700 leading-relaxed mb-4">You may have rights to:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Access, update, or delete your information</li>
                <li>Opt out of marketing</li>
                <li>Withdraw consent</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                To make a request, contact: <strong style={{ color: '#e06e00' }}>privacy@lawproactive.com</strong>
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>Attorney Advertising & No Legal Advice</h2>
              <p className="text-slate-700 leading-relaxed">
                LawProactive is not a law firm. No content on our website should be construed as legal advice.
                Attorney listings are paid advertisements. No attorney-client relationship is formed by using this site.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>International Visitors</h2>
              <p className="text-slate-700 leading-relaxed">
                If you access our platform from outside the U.S., your information will be transferred and processed in the U.S.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>Changes to This Policy</h2>
              <p className="text-slate-700 leading-relaxed">
                We may update this Privacy Policy as our services evolve or laws change.
                The updated version will include a new effective date.
              </p>
            </section>

            <section className="mb-8 p-6 bg-orange-50 rounded-lg border-l-4" style={{ borderLeftColor: '#e06e00' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#e06e00' }}>Contact Us</h2>
              <p className="text-slate-700 leading-relaxed">
                If you have questions about this Privacy Policy or wish to exercise your rights, contact:
                <br />
                Email: <strong style={{ color: '#e06e00' }}>privacy@lawproactive.com</strong>
                <br />
                Address: 4001 Inglewood Ave, Suite 233, Redondo Beach, CA 90278
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}