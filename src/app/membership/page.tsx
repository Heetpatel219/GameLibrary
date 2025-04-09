"use client";
import { useState } from "react";
import { Check, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MembershipPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Basic",
      description: "For casual gamers",
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      features: [
        "Access to 50+ games",
        "HD streaming",
        "Play on 1 device",
        "Email support"
      ],
      missing: [
        "No offline downloads",
        "No beta access"
      ],
      bgColor: "bg-gray-800"
    },
    {
      name: "Premium",
      description: "Most popular",
      monthlyPrice: 14.99,
      yearlyPrice: 149.99,
      features: [
        "Access to 100+ games",
        "4K streaming",
        "Play on 2 devices",
        "Priority support",
        "Offline downloads"
      ],
      missing: [
        "No exclusive content"
      ],
      bgColor: "bg-blue-900",
      isPopular: true
    },
    {
      name: "Ultimate",
      description: "For serious gamers",
      monthlyPrice: 24.99,
      yearlyPrice: 239.99,
      features: [
        "Access to 200+ games",
        "4K streaming with HDR",
        "Play on 4 devices",
        "24/7 support",
        "Early access to new games",
        "Exclusive content"
      ],
      missing: [],
      bgColor: "bg-purple-900"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="py-12 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Membership Plans</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose a plan that works for you. All plans include access to our game library.
          </p>
        </div>

        {/* Simple Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex border border-gray-700 rounded-md">
            <button
              className={`px-4 py-2 text-sm ${
                billingCycle === "monthly" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-800 text-gray-400"
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 text-sm ${
                billingCycle === "yearly" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-800 text-gray-400"
              }`}
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly (Save 15%)
            </button>
          </div>
        </div>

        {/* Simplified Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`${plan.bgColor} rounded-lg p-5 border border-gray-700 ${
                plan.isPopular ? "relative" : ""
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Popular
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
              
              <div className="mb-4">
                <div className="flex items-end">
                  <span className="text-3xl font-bold">
                    ${billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className="text-gray-400 ml-2 text-sm">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>
              </div>
              
              <button 
                className={`w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium mb-4 text-sm`}
              >
                Subscribe
              </button>
              
              <div>
                <p className="text-sm font-medium mb-2">Features:</p>
                <ul className="space-y-1 mb-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  
                  {plan.missing.map((feature, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-500">
                      <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Simplified FAQ */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">FAQs</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-400 text-sm">Yes, you can cancel your membership anytime with no fees.</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">How do I change plans?</h3>
              <p className="text-gray-400 text-sm">You can change your plan from your account settings page.</p>
            </div>
          </div>
        </div>
        
      </main>

      <Footer />
    </div>
  );
}