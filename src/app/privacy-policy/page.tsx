import Link from "next/link";
import { ShieldCheck, Lock, Eye, Server, RefreshCw } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | ShopSphere India",
  description: "ShopSphere India Privacy and Data Protection Policy compliant with DPDP Act 2023 and IT Rules.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="space-y-3 border-b border-slate-200 pb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Legal &amp; Compliance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Privacy &amp; Data Protection Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: October 2026 &bull; Effective immediately for all visitors and registered users of ShopSphere.
        </p>
      </div>

      <div className="prose prose-slate max-w-none space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" /> 1. Commitment to User Privacy
          </h2>
          <p>
            ShopSphere Technologies Private Limited (&quot;ShopSphere&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the e-commerce marketplace at shopsphere.in. We are committed to safeguarding the personal data of our users in compliance with the Digital Personal Data Protection (DPDP) Act 2023 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-600" /> 2. Information We Collect
          </h2>
          <p>We collect information necessary to fulfill orders, prevent fraud, and enhance your shopping journey:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Identity &amp; Contact Data:</strong> Name, delivery address, phone number, and email address provided during checkout or registration.</li>
            <li><strong>Transactional Data:</strong> Order history, billing invoices, payment transaction tokens, and chosen payment methods (UPI, Card, NetBanking, COD). Note: We never store your CVV, debit/credit card pins, or netbanking passwords. All card information is processed through PCI-DSS Level 1 compliant Razorpay gateways.</li>
            <li><strong>Device &amp; Telemetry Data:</strong> IP address, browser type, operating system, and session timestamps used for account security and fraud prevention.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-600" /> 3. How We Utilize Your Data
          </h2>
          <p>Your data is strictly utilized for legitimate business purposes:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Processing, packing, and dispatching your orders with our logistics partners (BlueDart, Delhivery, Xpressbees).</li>
            <li>Sending critical transactional updates via email and SMS (order confirmation, dispatch notifications, OTP verification).</li>
            <li>Preventing fraudulent transactions and ensuring inventory integrity.</li>
            <li>Complying with statutory tax mandates (GST invoice filings with the Government of India).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" /> 4. Data Security &amp; Encryption
          </h2>
          <p>
            All network communication across ShopSphere is protected by modern Transport Layer Security (TLS 1.3). Passwords are cryptographically hashed using salted bcrypt prior to persistence. Administrative dashboards utilize strict role-based access control (RBAC), and session tokens are safeguarded with HTTP-only, SameSite cookies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-indigo-600" /> 5. Data Retention &amp; Customer Rights
          </h2>
          <p>
            Under the DPDP Act 2023, you have the right to review, update, or request erasure of your personal data when no pending statutory or audit requirements remain. You may request account deletion at any time by contacting our Grievance Officer at <a href="mailto:grievance@shopsphere.in" className="text-indigo-600 font-semibold underline">grievance@shopsphere.in</a>.
          </p>
        </section>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 mt-8">
          <h3 className="font-bold text-slate-900 text-sm">Grievance Redressal Officer</h3>
          <p className="text-xs text-slate-500">
            In accordance with IT Act 2000 and rules made there under:<br />
            <strong>Grievance Officer:</strong> Ananya Deshmukh<br />
            <strong>Email:</strong> grievance@shopsphere.in<br />
            <strong>Address:</strong> ShopSphere Tech Pvt Ltd, 100 Feet Rd, Indiranagar, Bengaluru, KA - 560038
          </p>
        </div>
      </div>
    </div>
  );
}
