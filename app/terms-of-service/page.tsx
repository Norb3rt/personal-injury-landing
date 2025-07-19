import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | LawProactive',
  description: 'Terms of Service for LawProactive legal document preparation platform and lead generation services.',
  robots: 'index, follow',
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
              <strong>Effective Date:</strong> July 18, 2025<br />
              <strong>Last Updated:</strong> July 18, 2025
            </p>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>1. Acceptance of Terms</h2>
              <p className="text-slate-700 leading-relaxed">
                These Terms of Service ("Terms") govern your access to and use of this website and its associated subdomains ("Platform"), operated by LawProactive ("Company," "we," "our," or "us"). By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree, please do not use the Platform.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>2. Platform Description</h2>
              <p className="text-slate-700 leading-relaxed">
                LawProactive provides automated legal document preparation software and a lead generation platform that connects consumers with licensed professionals. We are not a law firm, do not provide legal advice, and do not guarantee results or outcomes.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>3. No Legal Advice</h2>
              <p className="text-slate-700 leading-relaxed">
                Nothing on this site or within its tools, funnels, or subdomains constitutes legal advice. Any use of our platform does not create an attorney-client relationship between you and LawProactive.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>4. Use of Legal Professionals</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                In some cases, we may refer you to an independent, licensed attorney. These attorneys are not employees or agents of LawProactive. We do not control or supervise their work and accept no liability for their performance, advice, or errors.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                By using our site, you expressly acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>LawProactive is not responsible for any negligence, misconduct, errors, or omissions by referred or listed attorneys.</li>
                <li>All legal services, if rendered, are solely between you and the independent lawyer.</li>
                <li>You are responsible for performing your own due diligence before hiring any professional referred through our site.</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>5. Document Automation</h2>
              <p className="text-slate-700 leading-relaxed">
                Our platform may provide access to auto-generated legal forms and informational tools. These are intended for general use and may not be suitable for your specific legal situation. You are responsible for reviewing any document before use or filing.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>6. User Responsibilities</h2>
              <p className="text-slate-700 leading-relaxed mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Misuse or attempt to disrupt the platform.</li>
                <li>Submit false or misleading information.</li>
                <li>Hold LawProactive liable for actions or omissions of third-party professionals.</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>7. Subscriptions and Payments</h2>
              <p className="text-slate-700 leading-relaxed">
                If you subscribe to a paid plan, you agree to abide by our billing and cancellation terms. Refunds are not guaranteed unless required by law.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>8. Limitation of Liability</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                To the fullest extent permitted by law, LawProactive shall not be liable for:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Any damages arising from your use of the site, automated documents, or referrals;</li>
                <li>Losses resulting from the acts, advice, or omissions of independent lawyers.</li>
                <li>All services are provided "as is" and without warranties of any kind.</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>9. Dispute Resolution</h2>
              <p className="text-slate-700 leading-relaxed">
                Any disputes shall be governed by the laws of the State of California. You agree to submit to the exclusive jurisdiction of courts located in Los Angeles County, California.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>10. Changes to Terms</h2>
              <p className="text-slate-700 leading-relaxed">
                We may modify these Terms at any time. Updates will be posted with the new effective date. Continued use of the site constitutes acceptance of the updated terms.
              </p>
            </section>

            <section className="mb-8 p-6 bg-orange-50 rounded-lg border-l-4" style={{ borderLeftColor: '#e06e00' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#e06e00' }}>11. Contact</h2>
              <p className="text-slate-700 leading-relaxed">
                For questions or concerns, email us at: <strong style={{ color: '#e06e00' }}>legal@lawproactive.com</strong>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
