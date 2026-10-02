"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  MapPin,
  ShieldAlert,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { formatPrice } from "@/lib/utils";
import { SafeUser } from "@/types";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  const cartItemCount = useCartStore((s) => s.getTotalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch current user
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      fetch(`/api/products?q=${encodeURIComponent(searchQuery)}&limit=5`)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data.products || []);
          setIsSearching(false);
          setSearchDropdownOpen(true);
        })
        .catch(() => setIsSearching(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener for search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchDropdownOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 text-center flex items-center justify-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>
          Festive Offer: Use code <strong className="text-amber-300 font-semibold">WELCOME10</strong> for 10% off • Free Express Delivery above ₹999
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <span className="text-white font-black text-xl tracking-tighter">S</span>
            </div>
            <div>
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                Shop<span className="text-indigo-600">Sphere</span>
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                India
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div ref={searchRef} className="hidden md:block flex-1 max-w-lg relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setSearchDropdownOpen(true);
                }}
                placeholder="Search products, brands, ethnic wear, gadgets..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-100/80 border border-slate-200 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              {isSearching && (
                <div className="absolute right-3.5 top-3.5 w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              )}
            </form>

            {/* Live Autocomplete Results */}
            {searchDropdownOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                <div className="p-2 border-b border-slate-100 text-xs font-semibold text-slate-400 px-3 uppercase tracking-wider">
                  Products matching &quot;{searchQuery}&quot;
                </div>
                <div className="divide-y divide-slate-50">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.slug}`}
                      onClick={() => setSearchDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        <Image
                          src={item.images[0]?.url || "/placeholder.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.brand}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-slate-900">{formatPrice(item.price)}</span>
                        {item.compareAtPrice && (
                          <p className="text-[11px] text-slate-400 line-through">
                            {formatPrice(item.compareAtPrice)}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/search?q=${encodeURIComponent(searchQuery)}`}
                  onClick={() => setSearchDropdownOpen(false)}
                  className="flex items-center justify-between p-3 bg-slate-50 hover:bg-indigo-50 text-indigo-600 text-xs font-semibold transition-colors"
                >
                  <span>View all results</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="p-2 sm:p-2.5 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-full relative transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 sm:p-2.5 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-full relative transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Account / Auth Dropdown */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                    {user.image ? (
                      <Image src={user.image} alt={user.name} width={32} height={32} className="object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <span className="hidden sm:inline-block text-sm font-medium text-slate-800 max-w-[100px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-sm hover:shadow transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}

              {/* User Menu Dropdown */}
              {user && userMenuOpen && (
                <div
                  onMouseLeave={() => setUserMenuOpen(false)}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    {user.role === "ADMIN" && (
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                        Admin Portal
                      </span>
                    )}
                  </div>

                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4 mr-3" />
                      Admin Dashboard
                    </Link>
                  )}

                  <Link
                    href="/account"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                  >
                    <User className="w-4 h-4 mr-3 text-slate-400" />
                    Account Overview
                  </Link>

                  <Link
                    href="/account/orders"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                  >
                    <Package className="w-4 h-4 mr-3 text-slate-400" />
                    My Orders
                  </Link>

                  <Link
                    href="/account/addresses"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                  >
                    <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                    Saved Addresses
                  </Link>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </form>
        </div>

        {/* Category Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-8 py-2.5 border-t border-slate-100 text-sm font-medium text-slate-600">
          <Link href="/products" className="hover:text-indigo-600 transition-colors">
            All Products
          </Link>
          <Link href="/categories/electronics-audio" className="hover:text-indigo-600 transition-colors">
            Electronics & Audio
          </Link>
          <Link href="/categories/mens-fashion" className="hover:text-indigo-600 transition-colors">
            Men&apos;s Fashion
          </Link>
          <Link href="/categories/womens-fashion" className="hover:text-indigo-600 transition-colors">
            Women&apos;s Ethnic
          </Link>
          <Link href="/categories/home-living" className="hover:text-indigo-600 transition-colors">
            Home & Living
          </Link>
          <Link href="/categories/beauty-wellness" className="hover:text-indigo-600 transition-colors">
            Beauty & Wellness
          </Link>
          <Link href="/categories/footwear-accessories" className="hover:text-indigo-600 transition-colors">
            Footwear & Watches
          </Link>
          <Link
            href="/products?bestseller=true"
            className="text-amber-600 font-semibold hover:text-amber-700 transition-colors ml-auto flex items-center gap-1"
          >
            🔥 Best Sellers
          </Link>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[110px] bg-white z-40 overflow-y-auto px-6 py-6 border-t border-slate-200">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Categories</p>
            <div className="flex flex-col space-y-3 font-medium text-slate-800">
              <Link href="/products" onClick={() => setMobileMenuOpen(false)}>
                All Products
              </Link>
              <Link href="/categories/electronics-audio" onClick={() => setMobileMenuOpen(false)}>
                Electronics & Audio
              </Link>
              <Link href="/categories/mens-fashion" onClick={() => setMobileMenuOpen(false)}>
                Men&apos;s Fashion
              </Link>
              <Link href="/categories/womens-fashion" onClick={() => setMobileMenuOpen(false)}>
                Women&apos;s Ethnic
              </Link>
              <Link href="/categories/home-living" onClick={() => setMobileMenuOpen(false)}>
                Home & Living
              </Link>
              <Link href="/categories/beauty-wellness" onClick={() => setMobileMenuOpen(false)}>
                Beauty & Wellness
              </Link>
              <Link href="/categories/footwear-accessories" onClick={() => setMobileMenuOpen(false)}>
                Footwear & Watches
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Quick Links</p>
              <div className="flex flex-col space-y-3 text-slate-700">
                <Link href="/account/orders" onClick={() => setMobileMenuOpen(false)}>
                  Track Orders
                </Link>
                <Link href="/account/wishlist" onClick={() => setMobileMenuOpen(false)}>
                  My Wishlist
                </Link>
                <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                  About Us
                </Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  Contact & Support
                </Link>
                <Link href="/faq" onClick={() => setMobileMenuOpen(false)}>
                  FAQ
                </Link>
              </div>
            </div>

            {user?.role === "ADMIN" && (
              <div className="pt-4 border-t border-slate-200">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl"
                >
                  <ShieldAlert className="w-5 h-5" />
                  Admin Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
