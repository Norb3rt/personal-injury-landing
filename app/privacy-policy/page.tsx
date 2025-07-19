import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | LawProactive',
  description: 'Privacy Policy for LawProactive - Learn how we collect, use, and protect your personal information.',
  robots: 'index, follow',
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
              <strong>Effective Date:</strong> July 18, 2025<br />
              <strong>Last Updated:</strong> July 18, 2025
            </p>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>1. Introduction</h2>
              <p className="text-slate-700 leading-relaxed">
                This Privacy Policy explains how LawProactive ("we", "us", "our") collects, uses, and protects your information.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>2. What We Collect</h2>
              <p className="text-slate-700 leading-relaxed mb-4">We may collect:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Name, email, phone number, and submitted legal details.</li>
                <li>Funnel interaction data and IP addresses.</li>
                <li>Payment information (processed via secure third-party gateways).</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>3. How We Use It</h2>
              <p className="text-slate-700 leading-relaxed mb-4">We use your data to:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Operate and improve our website and automation tools.</li>
                <li>Deliver the services you request.</li>
                <li>Refer you to independent lawyers when requested.</li>
                <li>Comply with legal obligations.</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>4. Third-Party Sharing and Lead Distribution</h2>
              <p className="text-slate-700 leading-relaxed mb-4">We may share your information with:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li>Independent lawyers you request contact with.</li>
                <li>Licensed attorneys or legal professionals who rent funnel space on our platform or pay for lead access.</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                This transfer of data may be considered a "sale" of personal information under some privacy laws. We do not sell your information in bulk or to unrelated data brokers.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>5. Your Rights</h2>
              <p className="text-slate-700 leading-relaxed mb-4">You may:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li>Request a copy of your data.</li>
                <li>Ask us to delete your information.</li>
                <li>Opt out of marketing communications.</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                Email <strong style={{ color: '#e06e00' }}>legal@lawproactive.com</strong> to exercise your rights.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>6. Security</h2>
              <p className="text-slate-700 leading-relaxed">
                We use industry-standard encryption and access controls, but cannot guarantee 100% security of any digital platform.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>7. Cookies</h2>
              <p className="text-slate-700 leading-relaxed">
                We use cookies for analytics, site performance, and personalized content. You can manage cookie preferences through your browser.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>8. Children</h2>
              <p className="text-slate-700 leading-relaxed">
                This site is not intended for users under 18. We do not knowingly collect data from minors.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>9. California Privacy Rights (CCPA/CPRA)</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                If you are a California resident, you have the right to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li>Know what personal information we collect and how we use it.</li>
                <li>Request that we delete your personal information.</li>
                <li>Opt out of the sale or sharing of your personal information.</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                To submit a request, email us at <strong style={{ color: '#e06e00' }}>legal@lawproactive.com</strong> with the subject line "CCPA Request."
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: '#0B6B65' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#0B6B65' }}>10. Changes to Privacy Policy</h2>
              <p className="text-slate-700 leading-relaxed">
                We reserve the right to update this policy. Continued use of the site means you accept the updated version.
              </p>
            </section>

            <section className="mb-8 p-6 bg-orange-50 rounded-lg border-l-4" style={{ borderLeftColor: '#e06e00' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#e06e00' }}>11. Contact Us</h2>
              <p className="text-slate-700 leading-relaxed">
                For privacy concerns: <strong style={{ color: '#e06e00' }}>legal@lawproactive.com</strong>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
