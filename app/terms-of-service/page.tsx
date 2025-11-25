import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | LawProactive',
  description: 'Terms of Service for LawProactive legal document preparation platform and lead generation services.',
  robots: 'index, follow',
  alternates: {
    canonical: '/terms-of-service',
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg p-8 border-0">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#0B6B65' }}>Terms of Service</h1>
            <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: '#e06e00' }}></div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              <strong>Effective Date:</strong> July 29, 2025
            </p>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>Introduction</h2>
              <p className="text-slate-700 leading-relaxed">
                PLEASE READ THESE TERMS OF USE CAREFULLY BEFORE USING THIS SITE.
              </p>
              <p className="text-slate-700 leading-relaxed">
                By using the LawProactive.com website (the "Site") or any related services, subdomains, or digital tools (collectively, the "Platform"), you agree to be bound by these Terms of Use and all applicable laws and regulations. These Terms of Use govern your use of the Platform and the services offered by LawProactive, Inc. ("LawProactive," "we," "us," or "our").
              </p>
              <p className="text-slate-700 leading-relaxed">
                LawProactive is not a law firm and does not provide legal advice or legal representation. We are a California-registered and bonded Legal Document Assistant (LDA) platform operating under California Business & Professions Code §§ 6400-6415. We also offer advertising services to attorneys and law firms through paid landing pages and directory listings. Use of this Platform does not create an attorney-client relationship.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>1. Privacy Policy</h2>
              <p className="text-slate-700 leading-relaxed">
                Your use of this Platform is subject to our Privacy Policy, which is incorporated into these Terms of Use by reference. The Privacy Policy explains how we collect, use, and protect your personal information.
              </p>
              <p className="text-slate-700 leading-relaxed">
                You agree that any information you provide is accurate and complete. You are responsible for maintaining the confidentiality of your login credentials and are liable for any activity that occurs under your account. You agree to notify us immediately of any unauthorized use of your account or password.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>2. Ownership and Intellectual Property</h2>
              <p className="text-slate-700 leading-relaxed">
                All content on this Site, including text, graphics, logos, forms, designs, software, and documentation (the "Materials"), is the property of LawProactive or its licensors. Except as expressly permitted, you may not copy, reproduce, republish, transmit, distribute, or modify the Materials without our prior written consent. All rights not expressly granted are reserved.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>3. Limited License</h2>
              <p className="text-slate-700 leading-relaxed">
                We grant you a limited, non-exclusive, non-transferable license to use the Site and its Materials for personal or internal business use only, and only as permitted by these Terms. This license does not include the right to resell, redistribute, or create derivative works of our Materials. This license terminates automatically if you violate these Terms.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>4. Third-Party Links</h2>
              <p className="text-slate-700 leading-relaxed">
                This Platform may contain links to third-party websites or services ("Third-Party Sites") for your convenience. LawProactive does not control or endorse these sites and is not responsible for their content, policies, or services. Your use of any Third-Party Site is at your own risk.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>5. Document Automation and Advertising Services</h2>
              <p className="text-slate-700 leading-relaxed">
                LawProactive provides self-help legal document preparation services at your direction. Our software automates form completion based on your responses and does not provide legal advice, guidance, or analysis. LawProactive is not a substitute for the advice of an attorney.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Additionally, we host landing pages and public profiles for attorneys who pay to advertise their services. These listings are paid advertisements. LawProactive does not endorse, recommend, refer, or evaluate any attorney listed on the Platform.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>6. No Legal Advice or Attorney-Client Relationship</h2>
              <p className="text-slate-700 leading-relaxed">
                Your use of this Platform does not create an attorney-client relationship with LawProactive or any of its agents. We do not provide legal consultations or represent you in any legal matter. If you require legal advice, you should consult with a licensed attorney.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>7. Arbitration and Dispute Resolution</h2>
              <p className="text-slate-700 leading-relaxed">
                You agree that any dispute between you and LawProactive will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. You waive your right to a jury trial or to participate in class actions. Any arbitration will be held in Los Angeles County, California, unless otherwise agreed. Exceptions: You may assert claims in small claims court or seek injunctive relief for intellectual property violations.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>8. User Content</h2>
              <p className="text-slate-700 leading-relaxed">
                If you submit reviews, comments, or other content ("User Content"), you grant LawProactive a non-exclusive, royalty-free, perpetual license to use, modify, reproduce, and display such content for any purpose. You represent that your User Content does not violate any laws or third-party rights. LawProactive reserves the right to remove or modify any User Content at our sole discretion.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>9. No Warranty</h2>
              <p className="text-slate-700 leading-relaxed">
                All services and Materials are provided "AS IS" without warranties of any kind. LawProactive disclaims all warranties, express or implied, including but not limited to merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee uninterrupted access, accuracy, or outcomes from using the Site or Services.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>10. Limitation of Liability</h2>
              <p className="text-slate-700 leading-relaxed">
                To the fullest extent permitted by law, LawProactive shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of the Site or Services. Our total liability shall not exceed the amount you paid for the applicable service. Some jurisdictions do not allow limitation of liability, so this may not apply to you.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>11. Eligibility and Jurisdiction</h2>
              <p className="text-slate-700 leading-relaxed">
                You must be at least 18 years old to use this Platform. By using the Platform, you represent and warrant that you are of legal age and have the legal capacity to enter into this agreement. The Platform is intended for use within the United States. LawProactive makes no representations that the services or content are appropriate or available for use in other jurisdictions. Accessing the Platform from outside the U.S. is done at your own risk and you are responsible for compliance with local laws.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>12. Attorney Listings and Landing Pages</h2>
              <p className="text-slate-700 leading-relaxed">
                Attorneys listed on LawProactive have paid for advertising placement and are not endorsed, reviewed, or recommended by LawProactive. Listings are for informational purposes only. LawProactive does not verify the licensing status, qualifications, or availability of any attorney listed. All legal engagements are strictly between the user and the listed attorney. LawProactive assumes no responsibility for any legal services rendered by third-party professionals.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }} >
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>13. Directory and Publishing Platform</h2>
              <p className="text-slate-700 leading-relaxed">
                LawProactive offers a digital publishing service where attorneys and law firms may post public-facing landing pages and profiles categorized by geography and practice area. These pages are advertisements. LawProactive does not operate a lawyer referral service and is not a certified lawyer referral service under the State Bar of California or any other jurisdiction.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>14. Payment Terms</h2>
              <p className="text-slate-700 leading-relaxed">
                Some features of the Platform require payment, including document preparation services and advertising placements. All fees are due at the time of service and are non-refundable unless otherwise stated in writing. Attorneys who rent landing pages or directory listings are responsible for complying with applicable state bar advertising rules. LawProactive does not guarantee traffic, leads, or outcomes.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>15. Modifications to Terms and Services</h2>
              <p className="text-slate-700 leading-relaxed">
                LawProactive reserves the right to update or modify these Terms at any time. Any changes will be effective upon posting to the Platform, with the updated date indicated at the top. Continued use of the Platform after changes constitutes your acceptance of the revised Terms. We may also modify or discontinue services, temporarily or permanently, with or without notice. You agree that we are not liable for any modification, suspension, or discontinuation.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>16. Termination</h2>
              <p className="text-slate-700 leading-relaxed">
                We reserve the right to suspend or terminate your access to the Platform at our sole discretion, with or without notice, for any conduct that violates these Terms or is otherwise deemed harmful to LawProactive or its users. You may terminate your use at any time by ceasing to access the Platform. Sections intended to survive termination (e.g., disclaimers, limitation of liability, arbitration) will remain in effect.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>17. Copyright Infringement and DMCA Notice</h2>
              <p className="text-slate-700 leading-relaxed">
                If you believe any content on the Platform infringes your copyright, you may submit a DMCA takedown notice to: Legal Department – LawProactive, Legal@lawproactive.com. Your notice must comply with the requirements of the Digital Millennium Copyright Act, including identification of the work, your contact info, and a sworn statement of good faith belief.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>18. No Guarantee of Results</h2>
              <p className="text-slate-700 leading-relaxed">
                We do not and cannot guarantee any legal outcome, case result, or specific performance from using our document preparation tools or from contacting attorneys through our platform. Your results may vary depending on your individual circumstances and legal issues. Legal matters involve risk, and users should consult with a licensed attorney if they require personalized advice.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }} >
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>19. Export Compliance</h2>
              <p className="text-slate-700 leading-relaxed">
                You may not use or export any content or software from this Platform in violation of U.S. export laws. By using the Platform, you represent that you are not located in a country subject to U.S. sanctions or listed on any U.S. government restricted party list.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>20. Force Majeure</h2>
              <p className="text-slate-700 leading-relaxed">
                LawProactive shall not be liable for any delay or failure to perform due to causes beyond its reasonable control, including but not limited to natural disasters, acts of government, war, terrorism, labor disputes, or technical failures.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }} >
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>21. Electronic Communications and Signatures</h2>
              <p className="text-slate-700 leading-relaxed">
                By using the LawProactive platform, you consent to receive communications from us electronically, including via email, SMS, system notifications, or other digital methods. You agree that all such electronic communications satisfy any legal requirement that they be in writing. You further consent to the use of electronic signatures, contracts, orders, and other records, and to electronic delivery of notices, policies, and records of transactions initiated or completed through the platform.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>22. Entire Agreement</h2>
              <p className="text-slate-700 leading-relaxed">
                These Terms of Use, together with our Privacy Policy and any supplemental terms or disclosures referenced herein, constitute the entire agreement between you and LawProactive regarding use of the platform. They supersede all prior or contemporaneous communications and proposals, whether oral or written, between you and LawProactive. No waiver or modification of any provision shall be valid unless in writing and agreed upon by both parties.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>23. Waiver and Severability</h2>
              <p className="text-slate-700 leading-relaxed">
                Failure by LawProactive to enforce any right or provision in these Terms shall not constitute a waiver of such right or provision. If any term or provision is found by a court of competent jurisdiction to be invalid, illegal, or unenforceable, the remaining provisions shall remain in full force and effect, and the invalid portion shall be interpreted or modified to the minimum extent necessary to make it enforceable and consistent with the original intent.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>24. Assignment</h2>
              <p className="text-slate-700 leading-relaxed">
                You may not assign, delegate, or transfer your rights or obligations under these Terms without prior written consent from LawProactive. Any attempt to do so shall be null and void. LawProactive may freely assign or transfer these Terms, including any rights or obligations herein, in connection with a merger, acquisition, corporate reorganization, or sale of assets, or by operation of law.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>25. Right to Refuse Service</h2>
              <p className="text-slate-700 leading-relaxed">
                LawProactive reserves the right, in its sole discretion, to refuse, suspend, or terminate access to any of its services, features, or digital platforms to any individual, user, attorney, or entity at any time and for any reason, including but not limited to:
              </p>
              <h3 className="text-lg font-semibold mt-4 mb-2" style={{ color: '#0B6B65' }}>Users:</h3>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Violating these Terms of Use or applicable laws</li>
                <li>Engaging in fraudulent, abusive, or harmful conduct</li>
                <li>Submitting misleading or incomplete information</li>
                <li>Attempting to misuse or exploit the platform beyond its intended scope</li>
                <li>Harassing or threatening LawProactive staff, attorneys, or other users</li>
              </ul>
              <h3 className="text-lg font-semibold mt-4 mb-2" style={{ color: '#0B6B65' }}>Attorneys & Legal Advertisers:</h3>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Providing false, misleading, or noncompliant advertising content</li>
                <li>Failure to comply with state bar advertising rules or applicable legal ethics</li>
                <li>Repeated complaints or unresolved issues from users</li>
                <li>Use of LawProactive to engage in unethical solicitation or unauthorized practice of law</li>
                <li>Unauthorized use of LawProactive trademarks, technology, or leads</li>
                <li>Refusal to correct or update content upon request</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                LawProactive also reserves the right to remove listings, landing pages, or content that compromises the integrity, safety, or legal compliance of the platform. Nothing herein waives LawProactive’s right to pursue additional legal remedies.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>26. Acknowledgment</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                By accessing or using the LawProactive platform, you expressly acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>You have read, understood, and accepted these Terms of Use and our Privacy Policy.</li>
                <li>LawProactive is not a law firm, does not provide legal advice, and does not establish attorney-client relationships.</li>
                <li>LawProactive is a registered and bonded Legal Document Assistant (LDA) under California Business & Professions Code §§ 6400–6415. Legal document services are provided at your direction only.</li>
                <li>LawProactive hosts attorney advertisements through paid landing pages and directory listings. These listings are for informational and advertising purposes only and do not constitute endorsements, referrals, or evaluations.</li>
                <li>Any engagement, communication, or contract with a listed attorney is solely between you and the attorney. LawProactive is not a party to any such relationship and bears no liability for attorney conduct or legal outcomes.</li>
                <li>Information submitted through this platform is not protected by attorney-client privilege and should not be considered confidential.</li>
                <li>You are responsible for conducting your own due diligence before hiring any attorney listed on the platform.</li>
                <li>Continued use of the platform confirms your agreement to these terms in full.</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-orange-50 rounded-lg border-l-4" style={{ borderLeftColor: '#e06e00' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#e06e00' }}>Contact Us</h2>
              <p className="text-slate-700 leading-relaxed">
                For inquiries, contact:
                <br />
                LawProactive
                <br />
                4001 Inglewood Avenue, Suite 233
                <br />
                Redondo Beach, California 90278
                <br />
                Email: <strong style={{ color: '#e06e00' }}>legal@lawproactive.com</strong>
              </p>
            </section>
          </div>
        </div >
      </div >
    </div >
  )
}