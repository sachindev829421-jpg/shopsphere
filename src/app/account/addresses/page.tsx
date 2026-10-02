"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Trash2, CheckCircle2, X } from "lucide-react";
import { Address } from "@/types";
import { toast } from "sonner";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const fetchAddresses = () => {
    setIsLoading(true);
    fetch("/api/account/addresses")
      .then((res) => res.json())
      .then((data) => {
        if (data.addresses) setAddresses(data.addresses);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          street,
          apartment,
          city,
          state,
          postalCode,
          isDefault,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to add address");
        return;
      }

      toast.success("New address saved!");
      setShowAddForm(false);
      setName("");
      setPhone("");
      setStreet("");
      setApartment("");
      setCity("");
      setState("");
      setPostalCode("");
      setIsDefault(false);
      fetchAddresses();
    } catch {
      toast.error("Failed to add address");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Address removed");
        setAddresses(addresses.filter((a) => a.id !== id));
      } else {
        toast.error("Failed to delete address");
      }
    } catch {
      toast.error("Error deleting address");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });
      if (res.ok) {
        toast.success("Default address updated");
        fetchAddresses();
      }
    } catch {
      toast.error("Failed to update default address");
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Saved Addresses</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage delivery destinations for faster checkout.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{showAddForm ? "Cancel" : "Add Address"}</span>
        </button>
      </div>

      {/* Add New Address Modal / Collapsible Form */}
      {showAddForm && (
        <form onSubmit={handleAddAddress} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">New Address Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Street Address & House No.
              </label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Apartment / Landmark
              </label>
              <input
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                City
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                State
              </label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                PIN Code (6 Digits)
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="def"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <label htmlFor="def" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Set as Default Address
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Save Address
          </button>
        </form>
      )}

      {/* Address cards */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading addresses...</div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12 text-slate-400 space-y-2">
          <MapPin className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-xs">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                addr.isDefault
                  ? "border-indigo-600 bg-indigo-50/20"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-slate-900">{addr.name}</h3>
                  {addr.isDefault ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Default
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-[10px] font-bold text-indigo-600 hover:underline"
                    >
                      Make Default
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-600">{addr.street}</p>
                {addr.apartment && <p className="text-xs text-slate-600">{addr.apartment}</p>}
                <p className="text-xs text-slate-600">
                  {addr.city}, {addr.state} - {addr.postalCode}
                </p>
                <p className="text-xs text-slate-400 mt-2">Phone: {addr.phone}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  aria-label="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
