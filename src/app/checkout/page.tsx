"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import {
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Banknote,
  MapPin,
  Plus,
  ArrowRight,
  Truck,
  AlertCircle,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import { Address, SafeUser } from "@/types";
import { toast } from "sonner";
import confetti from "canvas-confetti";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    coupon,
    clearCart,
    getSubtotal,
    getDiscount,
    getShipping,
    getTax,
    getTotal,
  } = useCartStore();

  const [user, setUser] = useState<SafeUser | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");

  // Form Address State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal();

  // Load user profile and saved addresses if logged in
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setName(data.user.name || "");
          setPhone(data.user.phone || "");

          // Load saved addresses
          fetch("/api/account/addresses")
            .then((res) => res.json())
            .then((addrData) => {
              if (addrData.addresses && addrData.addresses.length > 0) {
                setSavedAddresses(addrData.addresses);
                const defaultAddr = addrData.addresses.find((a: Address) => a.isDefault) || addrData.addresses[0];
                setSelectedAddressId(defaultAddr.id);
                fillFormWithAddress(defaultAddr);
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  const fillFormWithAddress = (addr: Address) => {
    setName(addr.name);
    setPhone(addr.phone);
    setStreet(addr.street);
    setApartment(addr.apartment || "");
    setCity(addr.city);
    setState(addr.state);
    setPostalCode(addr.postalCode);
  };

  const handleSelectSavedAddress = (addrId: string) => {
    setSelectedAddressId(addrId);
    if (addrId === "new") {
      setStreet("");
      setApartment("");
      setCity("");
      setState("");
      setPostalCode("");
    } else {
      const found = savedAddresses.find((a) => a.id === addrId);
      if (found) fillFormWithAddress(found);
    }
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !street || !city || !state || !postalCode) {
      toast.error("Please fill in all required shipping address fields");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      router.push("/products");
      return;
    }

    setIsProcessing(true);

    const shippingAddress = {
      name,
      phone,
      street,
      apartment,
      city,
      state,
      postalCode,
      country: "India",
    };

    try {
      // 1. Call server create-order endpoint
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress,
          couponCode: coupon?.code || null,
          paymentMethod,
          notes,
        }),
      });

      const orderData = await res.json();

      if (!res.ok) {
        toast.error(orderData.error || "Order creation failed");
        setIsProcessing(false);
        return;
      }

      // Handle Cash on Delivery (COD)
      if (paymentMethod === "COD") {
        clearCart();
        setOrderConfirmed({
          orderId: orderData.orderId,
          orderNumber: orderData.orderNumber,
          total: orderData.total,
          paymentMethod: "COD",
        });
        triggerCelebration();
        setIsProcessing(false);
        toast.success("Order confirmed successfully with Cash on Delivery!");
        return;
      }

      // Handle Razorpay Online Payment Flow
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ShopSphere India",
        description: `Order #${orderData.orderNumber}`,
        order_id: orderData.razorpayOrderId,
        handler: async function (response: any) {
          try {
            // Verify payment on server
            const verifyRes = await fetch("/api/checkout/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderNumber: orderData.orderNumber,
                items,
                shippingAddress,
                couponCode: coupon?.code || null,
                notes,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              clearCart();
              setOrderConfirmed({
                orderId: verifyData.orderId,
                orderNumber: verifyData.orderNumber,
                total: verifyData.total,
                paymentMethod: "RAZORPAY",
              });
              triggerCelebration();
              toast.success("Payment verified! Your order has been placed.");
            } else {
              toast.error(verifyData.error || "Payment verification failed");
            }
          } catch {
            toast.error("Error during payment verification");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: shippingAddress.name,
          email: user?.email || "customer@shopsphere.in",
          contact: shippingAddress.phone,
        },
        theme: {
          color: "#4f46e5",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info("Payment cancelled. You can retry anytime.");
          },
        },
      };

      // If in browser and Razorpay SDK is loaded
      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback simulation for local dev without live Razorpay SDK
        console.log("Simulating development checkout verification...");
        const verifyRes = await fetch("/api/checkout/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayOrderId: orderData.razorpayOrderId,
            razorpayPaymentId: `pay_mock_${Date.now()}`,
            razorpaySignature: `mock_sig_${Date.now()}`,
            orderNumber: orderData.orderNumber,
            items,
            shippingAddress,
            couponCode: coupon?.code || null,
            notes,
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          clearCart();
          setOrderConfirmed({
            orderId: verifyData.orderId,
            orderNumber: verifyData.orderNumber,
            total: verifyData.total,
            paymentMethod: "RAZORPAY",
          });
          triggerCelebration();
          toast.success("Payment verified! Order placed.");
        }
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Order processing error:", error);
      toast.error("Failed to place order. Please try again.");
      setIsProcessing(false);
    }
  };

  // If order was just placed, render Order Confirmation View
  if (orderConfirmed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Payment Confirmed
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Thank You for Your Order!
            </h1>
            <p className="text-sm text-slate-500">
              Order Number: <strong className="text-slate-800 font-mono text-base">{orderConfirmed.orderNumber}</strong>
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-600 max-w-md mx-auto space-y-2">
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <strong className="text-slate-900">{orderConfirmed.paymentMethod === "COD" ? "Cash on Delivery" : "Razorpay Online"}</strong>
            </div>
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <strong className="text-slate-900">{formatPrice(orderConfirmed.total)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Estimated Delivery:</span>
              <strong className="text-indigo-600">Within 3-4 Business Days</strong>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            A confirmation receipt and live tracking updates have been sent to your email.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href={`/account/orders`}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
            >
              Track in Order History
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="pb-6 border-b border-slate-200 mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Checkout & Order Fulfillment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete your shipping address and choose your preferred payment method.
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Addresses & Payment Methods */}
          <div className="lg:col-span-8 space-y-8">
            {/* Step 1: Address Selection */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  <span>1. Shipping Address</span>
                </h2>
              </div>

              {/* Saved Addresses Picker (if available) */}
              {savedAddresses.length > 0 && (
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                    Choose Saved Address
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectSavedAddress(addr.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-100"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <p className="font-bold text-xs text-slate-900">{addr.name}</p>
                        <p className="text-xs text-slate-600 mt-1">{addr.street}</p>
                        <p className="text-xs text-slate-500">{addr.city}, {addr.state} - {addr.postalCode}</p>
                        <p className="text-xs text-slate-400 mt-1">Phone: {addr.phone}</p>
                      </div>
                    ))}

                    <div
                      onClick={() => handleSelectSavedAddress("new")}
                      className={`p-4 rounded-2xl border border-dashed flex items-center justify-center cursor-pointer transition-all ${
                        selectedAddressId === "new"
                          ? "border-indigo-600 bg-indigo-50/50 text-indigo-700"
                          : "border-slate-300 text-slate-500 hover:border-indigo-400"
                      }`}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      <span className="text-xs font-semibold">Enter New Address</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Address Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Recipient's full name"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Phone Number (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Street Address & House No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="House number, building name, street address"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Apartment / Landmark / Suite (Optional)
                  </label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Near landmark, apartment floor, etc."
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai, New Delhi, Bengaluru"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra, Delhi, Karnataka"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    PIN Code (6 Digits) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 110001, 400001"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    disabled
                    value="India"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Delivery Instructions / Order Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Leave with security, call before arrival"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span>2. Payment Option</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Razorpay Online */}
                <label
                  onClick={() => setPaymentMethod("RAZORPAY")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === "RAZORPAY"
                      ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-100"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "RAZORPAY"}
                    onChange={() => setPaymentMethod("RAZORPAY")}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <p className="font-bold text-xs text-slate-900">Razorpay (Cards, UPI, Netbanking)</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pay instantly with Google Pay, PhonePe, Paytm, RuPay, Visa, Mastercard, or Netbanking.
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Recommended & Instant Confirmation
                    </span>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === "COD"
                      ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-100"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <p className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span>Cash on Delivery (COD)</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pay in cash or via mobile UPI QR scan upon courier doorstep delivery.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review Summary */}
          <div className="lg:col-span-4 space-y-6 self-start sticky top-28">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
                Order Review ({items.length} {items.length === 1 ? "item" : "items"})
              </h3>

              {/* Items summary */}
              <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
                {items.map((it) => (
                  <div key={it.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <div className="w-10 h-10 relative rounded-lg bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                        <Image src={it.image} alt={it.name} fill className="object-cover" />
                      </div>
                      <div className="truncate">
                        <p className="font-medium text-slate-800 truncate">{it.name}</p>
                        <p className="text-[11px] text-slate-400">Qty: {it.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      {formatPrice(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost breakdown */}
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon ({coupon?.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <strong className="text-emerald-600 font-bold uppercase">Free</strong>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-slate-900">{formatPrice(tax)}</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Total Payable</span>
                  <span className="text-xl font-black text-indigo-600">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isProcessing ? (
                  <span>Processing Secure Payment...</span>
                ) : (
                  <>
                    <span>
                      {paymentMethod === "COD" ? "Confirm COD Order" : `Pay ${formatPrice(total)} via Razorpay`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>HMAC-SHA256 Server Signature Guarded</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
