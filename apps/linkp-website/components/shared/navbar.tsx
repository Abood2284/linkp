// apps/linkp-website/components/shared/navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "../ui/button";

interface NavItem {
  label: string;
  link?: string;
  children?: { label: string; description: string; link: string }[];
}

const forBrands: NavItem = {
  label: "For Brands",
  children: [
    {
      label: "Brand Collaboration",
      description: "Find and work with amazing creators",
      link: "/brands/collaboration",
    },
    {
      label: "Campaign Management",
      description: "Manage your influencer campaigns",
      link: "/brands/campaigns",
    },
  ],
};

const forCreators: NavItem = {
  label: "For Creators",
  children: [
    {
      label: "Creator Tools",
      description: "Everything you need to grow",
      link: "/creators/tools",
    },
    {
      label: "Monetization",
      description: "Turn your passion into profit",
      link: "/creators/monetization",
    },
  ],
};

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownHover = (label: string) => {
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-coffee-800">Linkp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {/* For Brands Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover(forBrands.label)}
              onMouseLeave={handleDropdownLeave}
            >
              <button className="flex items-center space-x-1 text-gray-600 hover:text-coffee-600">
                <span>{forBrands.label}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === forBrands.label && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 top-full w-64 rounded-xl border bg-white p-4 shadow-lg"
                >
                  {forBrands.children?.map((item) => (
                    <Link
                      key={item.label}
                      href={item.link}
                      className="block rounded-lg p-3 hover:bg-gray-50"
                    >
                      <div className="font-medium text-gray-900">
                        {item.label}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.description}
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>

            {/* For Creators Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover(forCreators.label)}
              onMouseLeave={handleDropdownLeave}
            >
              <button className="flex items-center space-x-1 text-gray-600 hover:text-coffee-600">
                <span>{forCreators.label}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === forCreators.label && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 top-full w-64 rounded-xl border bg-white p-4 shadow-lg"
                >
                  {forCreators.children?.map((item) => (
                    <Link
                      key={item.label}
                      href={item.link}
                      className="block rounded-lg p-3 hover:bg-gray-50"
                    >
                      <div className="font-medium text-gray-900">
                        {item.label}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.description}
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>

            <Link
              href="/pricing"
              className="text-gray-600 hover:text-coffee-600"
            >
              Pricing
            </Link>

            <Link href="/about" className="text-gray-600 hover:text-coffee-600">
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden items-center space-x-4 md:flex">
            <Link href="/authentication">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/authentication">
              <Button className="bg-coffee-600 hover:bg-coffee-700">
                Get access →
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-b border-gray-200 bg-white md:hidden"
        >
          <div className="space-y-1 px-4 pb-3 pt-2">
            {/* Mobile For Brands */}
            <div className="space-y-2 py-2">
              <div className="font-medium text-gray-900">{forBrands.label}</div>
              {forBrands.children?.map((item) => (
                <Link
                  key={item.label}
                  href={item.link}
                  className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile For Creators */}
            <div className="space-y-2 py-2">
              <div className="font-medium text-gray-900">
                {forCreators.label}
              </div>
              {forCreators.children?.map((item) => (
                <Link
                  key={item.label}
                  href={item.link}
                  className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link
              href="/pricing"
              className="block rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-50"
            >
              Pricing
            </Link>

            <Link
              href="/about"
              className="block rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-50"
            >
              About
            </Link>

            <div className="space-y-2 pt-4">
              <Link href="/authentication" className="block">
                <Button variant="ghost" className="w-full justify-center">
                  Login
                </Button>
              </Link>
              <Link href="/authentication?signup=true" className="block">
                <Button className="w-full justify-center bg-coffee-600 hover:bg-coffee-700">
                  Get access →
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
