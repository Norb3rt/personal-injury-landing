import Link from "next/link"

export function Footer() {
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
