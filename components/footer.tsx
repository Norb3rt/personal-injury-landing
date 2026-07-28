"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function Footer() {
  const pathname = usePathname()

  if (pathname?.startsWith("/admin")) {
    return null
  }

  return (
    <footer className="bg-gray-900 text-white py-8 px-4 pb-20">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-gray-400 mb-4">
          Attorneys: Stop chasing leads.{" "}
          <Link href="http://leads.lawproactive.com" className="text-teal-400 hover:text-teal-300 underline">
            Secure your funnel
          </Link>{" "}
          and convert local searches into real clients.
        </p>

        <div className="max-w-4xl mx-auto text-gray-400 text-xs leading-relaxed space-y-4 mb-8">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-300">
            Attorney Advertising
          </h4>
          <p>
            LawProactive is an advertising platform. It is not a law firm, does not practice law, does not provide legal advice, and is not a lawyer referral service. LawProactive does not endorse, recommend, refer, or select any attorney, and does not evaluate, vouch for, or guarantee the qualifications, competence, or quality of any attorney or law firm. All listings are paid advertisements. The advertising attorney or law firm is solely responsible for the content and claims in its own listing and for compliance with the advertising rules of its jurisdiction.
          </p>
          <p>
            No legal advice is provided through this site. The information here is general and informational only. Using this site, submitting an inquiry, or contacting an advertiser through this site does not create an attorney-client relationship with LawProactive or any attorney. An attorney-client relationship is formed only when an attorney confirms it in a signed written agreement.
          </p>
          <p>
            Choosing an attorney is an important decision that should not be based solely on advertising. Any results, ratings, awards, or recognitions shown in a listing reflect only the advertiser's own statements and are not a promise or prediction about your matter; prior results do not guarantee a similar outcome. Advertising attorneys are licensed only in the jurisdictions identified in their listings, and the responsible attorney's name and office location are stated in each listing.
          </p>
          <p>
            California residents: This is an advertisement, not a referral. The attorney or law firm responsible for each listing is identified within that listing.
          </p>
          <p>
            New Jersey residents: No aspect of this advertisement has been approved by the Supreme Court of New Jersey.
          </p>

          <div className="pt-2">
            <Dialog>
              <DialogTrigger className="text-teal-400 hover:text-teal-300 underline font-semibold cursor-pointer">
                View Full Disclaimer & Legal Notices
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-gray-950 text-white border-gray-800 p-6">
                <DialogHeader className="border-b border-gray-800 pb-3">
                  <DialogTitle className="text-xl font-bold text-gray-100">Disclaimer & Legal Notices</DialogTitle>
                  <p className="text-xs text-gray-500 mt-1">Last updated: June 15, 2026</p>
                </DialogHeader>
                <div className="text-gray-300 text-xs space-y-4 mt-4 text-left leading-relaxed">
                  <p className="italic text-gray-400">
                    Please read these notices carefully. By accessing or using the LawProactive website (the “Site”), you acknowledge that you have read, understood, and agree to the notices and terms below. If you do not agree, do not use the Site.
                  </p>

                  <div className="border-t border-gray-800 pt-3">
                    <h3 className="font-semibold text-gray-200 text-sm">1. LawProactive Is Not a Law Firm</h3>
                    <p className="mt-1">
                      LawProactive is an advertising platform. It is <em>not</em> a law firm. It does not practice law, does not provide legal advice or legal services, and does not act as an attorney for any person. No content on the Site is legal advice, and nothing on the Site should be relied upon as a substitute for advice from a licensed attorney in your jurisdiction.
                    </p>
                    <p className="mt-1">
                      LawProactive employees and representatives are not acting as your attorney and cannot answer legal questions, evaluate your matter, or recommend a course of action.
                    </p>
                  </div>

                  <div className="border-t border-gray-800 pt-3">
                    <h3 className="font-semibold text-gray-200 text-sm">2. Not a Lawyer Referral Service</h3>
                    <p className="mt-1">
                      LawProactive is <em>not</em> a lawyer referral service. It does not refer, match, recommend, endorse, select, or steer any person to any attorney or law firm. It does not exercise judgment about which attorney is appropriate for any individual or matter. Attorneys and law firms purchase advertising space on the Site; their appearance is the result of a paid advertising arrangement and is not a referral, endorsement, or recommendation by LawProactive.
                    </p>
                  </div>

                  <div className="border-t border-gray-800 pt-3">
                    <h3 className="font-semibold text-gray-200 text-sm">3. Listings Are Paid Advertisements</h3>
                    <p className="mt-1">
                      All attorney and law firm listings on the Site are <em>paid advertisements</em>. The order, prominence, placement, or appearance of a listing reflects advertising arrangements and does not reflect any assessment by LawProactive of an attorney’s skill, experience, competence, or suitability.
                    </p>
                    <p className="mt-1">
                      The advertising attorney or law firm is <em>solely responsible</em> for the content, accuracy, and claims in its own listing, and for ensuring that its listing complies with the attorney-advertising rules, rules of professional conduct, and other laws of every jurisdiction in which it advertises or is licensed. LawProactive does not draft, verify, endorse, or adopt the statements made by advertisers.
                    </p>
                  </div>

                  <div className="border-t border-gray-800 pt-3">
                    <h3 className="font-semibold text-gray-200 text-sm">4. No Verification, No Endorsement, No Guarantee of Quality</h3>
                    <p className="mt-1">
                      LawProactive does not independently investigate, verify, vouch for, or guarantee any information in any listing, including an advertiser’s licensure, bar standing, credentials, areas of practice, experience, disciplinary history, results, or fees. The presence of an attorney or law firm on the Site is <em>not</em> a guarantee or warranty of that attorney’s qualifications or of the quality of legal services they may provide.
                    </p>
                    <p className="mt-1">
                      Choosing an attorney is an important decision that should not be based solely on advertisements. You are responsible for independently evaluating and selecting any attorney, including by confirming the attorney’s license and standing with the relevant state bar.
                    </p>
                  </div>

                  <div className="border-t border-gray-800 pt-3">
                    <h3 className="font-semibold text-gray-200 text-sm">5. No Attorney-Client Relationship</h3>
                    <p className="mt-1">
                      Using the Site, viewing a listing, submitting a contact form or inquiry, or otherwise communicating through the Site does <em>not</em> create an attorney-client relationship between you and LawProactive or between you and any advertising attorney. An attorney-client relationship is formed only after an attorney has agreed to represent you and has confirmed that representation in a signed written engagement agreement.
                    </p>
                    <p className="mt-1 font-semibold text-amber-400">
                      Do not send confidential or time-sensitive information through the Site or to any advertiser before an attorney-client relationship has been established in writing. Information you submit may not be privileged or confidential, and sending it does not obligate any attorney to respond or to take any action, including acting before a deadline or statute of limitations.
                    </p>
                  </div>

                  <div className="border-t border-gray-800 pt-3">
                    <h3 className="font-semibold text-gray-200 text-sm">6. No Guarantee of Results</h3>
                    <p className="mt-1">
                      Any case results, testimonials, reviews, ratings, awards, or recognitions that may appear in a listing reflect only the statements of the advertising attorney and are not promises, guarantees, or predictions about the outcome of your matter. <em>Prior results do not guarantee a similar outcome.</em> Every legal matter is different and depends on its own facts.
                    </p>
                  </div>

                  <div className="border-t border-gray-800 pt-3">
                    <h3 className="font-semibold text-gray-200 text-sm">7. Accuracy and Availability</h3>
                    <p className="mt-1">
                      The Site is provided on an “as is” and “as available” basis. LawProactive does not warrant that the Site or any listing is accurate, complete, current, reliable, or error-free, and is not responsible for typographical errors, omissions, or outdated information. Listings may be changed, suspended, or removed at any time.
                    </p>
                  </div>

                  <div className="border-t border-gray-800 pt-3">
                    <h3 className="font-semibold text-gray-200 text-sm">8. Licensing and Jurisdiction</h3>
                    <p className="mt-1">
                      Attorneys advertising on the Site are licensed only in the jurisdictions stated in their individual listings, and may not be licensed in your state. Laws differ by jurisdiction. Nothing on the Site is an offer to represent you in any jurisdiction where an attorney is not licensed to practice.
                    </p>
                  </div>

                  <div className="border-t border-gray-800 pt-3">
                    <h3 className="font-semibold text-gray-200 text-sm">9. State-Specific Notices</h3>
                    <p className="mt-1">
                      The following notices are provided to address the requirements of certain states. They do not limit the general notices above.
                    </p>
                    <ul className="list-disc pl-4 mt-1 space-y-1">
                      <li>
                        <strong>California.</strong> This Site and its listings are advertisements. LawProactive is not a lawyer referral service and does not refer clients to attorneys. The attorney or law firm responsible for each listing, and that attorney’s office location, are identified within the listing.
                      </li>
                      <li>
                        <strong>New York.</strong> The content of this Site is <em>Attorney Advertising</em>.
                      </li>
                      <li>
                        <strong>New Jersey.</strong> No aspect of any advertisement on this Site has been approved by the Supreme Court of New Jersey.
                      </li>
                      <li>
                        <strong>Other states.</strong> Attorney-advertising rules vary by state. Each advertising attorney is responsible for compliance with the rules of the states in which it advertises and is licensed.
                      </li>
                    </ul>
                  </div>

                  <div className="border-t border-gray-800 pt-3">
                    <h3 className="font-semibold text-gray-200 text-sm">10. Third-Party Links and Content</h3>
                    <p className="mt-1">
                      The Site may contain links to third-party websites and content provided by advertisers. LawProactive does not control and is not responsible for the content, accuracy, privacy practices, or availability of any third-party site or material. Links and advertiser content do not constitute an endorsement.
                    </p>
                  </div>

                  <div className="border-t border-gray-800 pt-3">
                    <h3 className="font-semibold text-gray-200 text-sm">11. No Warranties</h3>
                    <p className="mt-1">
                      To the fullest extent permitted by law, LawProactive disclaims all warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, title, and non-infringement, with respect to the Site and any listing or content on it.
                    </p>
                  </div>

                  <div className="border-t border-gray-800 pt-3">
                    <h3 className="font-semibold text-gray-200 text-sm">12. Limitation of Liability</h3>
                    <p className="mt-1">
                      To the fullest extent permitted by law, LawProactive and its owners, officers, employees, and agents will not be liable for any indirect, incidental, consequential, special, exemplary, or punitive damages, or for any loss arising out of or related to your use of the Site, your reliance on any listing or content, or your dealings with any advertiser, even if advised of the possibility of such damages.
                    </p>
                  </div>

                  <div className="border-t border-gray-800 pt-3">
                    <h3 className="font-semibold text-gray-200 text-sm">13. Indemnification</h3>
                    <p className="mt-1">
                      You agree to indemnify and hold harmless LawProactive and its owners, officers, employees, and agents from any claims, damages, liabilities, costs, and expenses (including reasonable attorneys’ fees) arising out of your use of the Site or your dealings with any advertiser.
                    </p>
                  </div>

                  <div className="border-t border-gray-800 pt-3">
                    <h3 className="font-semibold text-gray-200 text-sm">14. Reporting a Concern or Requesting Correction or Removal</h3>
                    <p className="mt-1">
                      If you believe a listing is inaccurate, misleading, or non-compliant, or if you are an advertiser who wishes to correct or remove a listing, contact us at <a href="mailto:Legal@lawproactive.com" className="text-teal-400 hover:underline">Legal@lawproactive.com</a>. We will review requests and take appropriate action, which may include correcting or removing the listing.
                    </p>
                  </div>

                  <div className="border-t border-gray-800 pt-3">
                    <h3 className="font-semibold text-gray-200 text-sm">15. Changes to These Notices</h3>
                    <p className="mt-1">
                      LawProactive may update these notices at any time. Changes take effect when posted. Your continued use of the Site after changes are posted constitutes acceptance of the updated notices.
                    </p>
                  </div>

                  <div className="border-t border-gray-800 pt-3 text-gray-400">
                    <h3 className="font-semibold text-gray-200 text-sm">16. Contact</h3>
                    <p className="mt-1">
                      LawProactive, Inc.<br />
                      4001 Inglewood Ave., Suite 233<br />
                      Redondo Beach, CA 90278<br />
                      Email: <a href="mailto:Legal@lawproactive.com" className="text-teal-400 hover:underline">Legal@lawproactive.com</a>
                    </p>
                  </div>

                  <div className="border-t border-gray-800 pt-3 text-center text-gray-500 text-[10px]">
                    These notices are part of and incorporated into the LawProactive Terms of Use.
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Legal Links */}
        <div className="flex justify-center items-center gap-6 mb-4">
          <Link
            href="https://www.lawproactive.com/terms-of-service"
            className="text-gray-400 hover:text-white transition-colors duration-300 text-sm underline"
          >
            Terms of Service
          </Link>
          <span className="text-gray-600">|</span>
          <Link
            href="https://www.lawproactive.com/privacy-policy"
            className="text-gray-400 hover:text-white transition-colors duration-300 text-sm underline"
          >
            Privacy Policy
          </Link>
        </div>

        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} LawProactive. All rights reserved.</p>
      </div>
    </footer>
  )
}
