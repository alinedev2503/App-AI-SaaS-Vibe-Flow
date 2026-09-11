import React from "react";
import { useAuth } from "@/contexts/AuthContext";

export const SubscriptionOverview: React.FC = () => {
  const { user } = useAuth();

  // Mocking billing date for now - this should ideally come from an API
  const nextBillingDate = new Date();
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

  const handleManageBilling = () => {
    // Redirect to Stripe customer portal
    window.location.href = "/api/stripe/create-portal-session";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Subscription Overview</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Active Plan</p>
          <p className="text-lg font-medium capitalize">{user?.subscription_tier || "Free"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Next Billing Date</p>
          <p className="text-lg font-medium">{nextBillingDate.toLocaleDateString()}</p>
        </div>
        <button
          onClick={handleManageBilling}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Manage Billing
        </button>
      </div>
    </div>
  );
};
