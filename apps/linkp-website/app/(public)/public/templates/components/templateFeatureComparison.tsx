"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Feature categories
const featureCategories = [
  {
    name: "Core Features",
    features: [
      { id: "responsive", name: "Responsive Design", description: "Optimized for all devices", plans: ["free", "pro", "business"] },
      { id: "tracking", name: "Link Tracking", description: "Track clicks and engagement", plans: ["free", "pro", "business"] },
      { id: "custom-colors", name: "Custom Colors", description: "Personalize colors and theme", plans: ["free", "pro", "business"] },
    ]
  },
  {
    name: "Advanced Features",
    features: [
      { id: "animations", name: "Animations", description: "Smooth transitions and effects", plans: ["pro", "business"] },
      { id: "advanced-analytics", name: "Advanced Analytics", description: "Detailed visitor insights", plans: ["pro", "business"] },
      { id: "custom-domain", name: "Custom Domain", description: "Use your own domain name", plans: ["business"] },
    ]
  },
  {
    name: "Monetization",
    features: [
      { id: "brand-collabs", name: "Brand Collaborations", description: "Connect with brands for partnerships", plans: ["pro", "business"] },
      { id: "payment-links", name: "Payment Links", description: "Sell products and services", plans: ["pro", "business"] },
      { id: "subscription", name: "Subscription Tools", description: "Offer paid memberships", plans: ["business"] },
    ]
  }
];

export default function TemplateFeatureComparison() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="text-lg font-semibold">Compare Plan Features</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </Button>

      <div 
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 border-t">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                    Feature
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Free
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pro
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {featureCategories.map((category) => (
                  <>
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-6 py-2 text-sm font-medium text-gray-900">
                        {category.name}
                      </td>
                    </tr>
                    {category.features.map((feature) => (
                      <tr key={feature.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{feature.name}</div>
                          <div className="text-xs text-gray-500">{feature.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {feature.plans.includes("free") ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {feature.plans.includes("pro") ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {feature.plans.includes("business") ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <h3 className="font-bold text-lg">Free</h3>
              <p className="text-2xl font-bold my-2">$0</p>
              <p className="text-gray-500 text-sm mb-4">Forever</p>
              <Button variant="outline" className="w-full">Start Free</Button>
            </div>
            
            <div className="p-4 border-2 border-blue-500 rounded-lg relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs py-1 px-3 rounded-full">
                Popular
              </div>
              <h3 className="font-bold text-lg">Pro</h3>
              <p className="text-2xl font-bold my-2">$15</p>
              <p className="text-gray-500 text-sm mb-4">per month</p>
              <Button className="w-full bg-blue-500 hover:bg-blue-600">Choose Pro</Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-bold text-lg">Business</h3>
              <p className="text-2xl font-bold my-2">$49</p>
              <p className="text-gray-500 text-sm mb-4">per month</p>
              <Button variant="outline" className="w-full">Choose Business</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
