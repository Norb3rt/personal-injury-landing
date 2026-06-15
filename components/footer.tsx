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

        <p className="text-gray-400 mb-3 text-sm">
          Attorney Advertising: LawProactive is not a law firm and does not provide legal advice. We provide legal document preparation services, ethical lead generation, and digital marketing services for attorneys, including a publishing platform for attorney listings. All listings are paid advertisements. LawProactive does not endorse, evaluate, assign, or refer attorneys. No attorney-client relationship is formed by using this website.
        </p>

        <p className="text-gray-400 mb-3 text-sm">
          This page is part of our attorney marketing software platform. Visitors are potential clients actively seeking legal help. All consultations are handled directly by the advertising attorney.
        </p>

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
