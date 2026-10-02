import { Truck, Clock, ShieldCheck, MapPin, PackageCheck, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Shipping & Delivery Policy | ShopSphere India",
  description: "Detailed shipping rates, pan-India delivery timelines, and courier partner details for ShopSphere.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="space-y-3 border-b border-slate-200 pb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Logistics &amp; Fulfillment
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Shipping &amp; Delivery Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: October 2026 &bull; Reliable Pan-India fulfillment across 19,000+ Indian PIN codes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-2 shadow-sm">
          <Truck className="w-8 h-8 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">Free Delivery</h3>
          <p className="text-xs text-slate-500">
            Complimentary shipping on all cart totals of ₹999 or above anywhere in India.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-2 shadow-sm">
          <Clock className="w-8 h-8 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">2-4 Day Metro Delivery</h3>
          <p className="text-xs text-slate-500">
            Rapid surface &amp; air express delivery across Bengaluru, Mumbai, Delhi-NCR, Pune, Hyderabad, and Chennai.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-2 shadow-sm">
          <PackageCheck className="w-8 h-8 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">Tamper-Proof Packaging</h3>
          <p className="text-xs text-slate-500">
            Specialized multi-layer bubble wrap &amp; moisture-resistant security bags for handlooms and electronics.
          </p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" /> 1. Serviceable Geographic Coverage
          </h2>
          <p>
            ShopSphere fulfills orders across all 28 states and 8 union territories in India, covering more than 19,000 postal PIN codes. We have tied up with Tier-1 logistics aggregators including <strong>BlueDart, Delhivery, Xpressbees, and Shadowfax</strong> to ensure complete tracking visibility.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" /> 2. Processing &amp; Transit Timelines
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Order Dispatch:</strong> All verified orders placed before 2:00 PM IST are processed and handed over to our carrier on the same business day. Orders placed on Sundays or national holidays are dispatched on the immediate following business day.
            </li>
            <li>
              <strong>Metros &amp; Tier-1 Cities:</strong> 2 to 4 business days after dispatch.
            </li>
            <li>
              <strong>Tier-2 &amp; Tier-3 Cities:</strong> 4 to 6 business days after dispatch.
            </li>
            <li>
              <strong>Northeast, Jammu &amp; Kashmir, Island Territories:</strong> 6 to 9 business days after dispatch.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-600" /> 3. Shipping Charges Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-200 rounded-xl overflow-hidden text-xs">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="p-3 border-b border-slate-200">Order Subtotal</th>
                  <th className="p-3 border-b border-slate-200">Payment Mode</th>
                  <th className="p-3 border-b border-slate-200">Shipping Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3">₹999 and above</td>
                  <td className="p-3">Prepaid (Razorpay / UPI / Cards) &amp; COD</td>
                  <td className="p-3 text-emerald-600 font-bold">FREE</td>
                </tr>
                <tr>
                  <td className="p-3">Under ₹999</td>
                  <td className="p-3">Prepaid (Razorpay / UPI / Cards)</td>
                  <td className="p-3 font-semibold text-slate-900">₹99 (Flat standard fee)</td>
                </tr>
                <tr>
                  <td className="p-3">Under ₹999</td>
                  <td className="p-3">Cash on Delivery (COD)</td>
                  <td className="p-3 font-semibold text-slate-900">₹99 (Flat standard fee)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-indigo-600" /> 4. Damaged or Tampered Shipments
          </h2>
          <p>
            If the outer carton shows signs of physical damage, tampering, or broken security tape upon delivery, please <strong>refuse delivery</strong> from the courier agent immediately or record an unboxing video upon opening. Immediately contact our support team at <a href="mailto:support@shopsphere.in" className="text-indigo-600 font-semibold underline">support@shopsphere.in</a> or +91 80 4920 1888 within 24 hours of delivery.
          </p>
        </section>
      </div>
    </div>
  );
}
