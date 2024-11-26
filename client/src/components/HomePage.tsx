import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CustomerReviews from "./CustomerReviews";
import { Feature, features } from "../data/features";

const HomePage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-primary-blue">
          San Antonio's Premier Bounce House Rentals
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Professional and timely bounce house rentals with free delivery and no
          deposit required
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-primary-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-indigo transition">
            Book Now
          </button>
          <Link
            to="/inventory"
            className="border border-primary-blue text-primary-blue px-8 py-3 rounded-lg font-semibold hover:bg-secondary-blue/10 transition"
          >
            View Inventory
          </Link>
        </div>

        {/* Customer Logos */}
        <div className="mt-16">
          <div className="flex justify-center items-center gap-8 mb-8">
            <CustomerReviews />
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="py-16 bg-secondary-blue/10 rounded-xl px-8 my-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary-purple">
          Planning a Party Shouldn't Be Stressful
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow hover:border-secondary-indigo transition duration-300 border-2 border-transparent">
            <p className="text-lg text-gray-600">
              Worried about safety and cleanliness?
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:border-secondary-indigo transition duration-300 border-2 border-transparent">
            <p className="text-lg text-gray-600">
              Need reliable and punctual service?
            </p>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary-purple">
          Your One-Stop Party Solution
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature: Feature, index: number) => (
            <div
              key={index}
              className="p-6 border rounded-lg hover:border-secondary-indigo transition duration-300"
            >
              <feature.icon className="w-12 h-12 text-primary-blue mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-primary-purple">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary-purple">
          Perfect For Any Occasion
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            "Birthday Parties",
            "School Events",
            "Church Functions",
            "Community Gatherings",
          ].map((event: string, index: number) => (
            <div
              key={index}
              className="p-6 bg-secondary-blue/10 rounded-lg text-center hover:bg-secondary-purple/10 transition duration-300"
            >
              <h3 className="font-semibold text-primary-blue">{event}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary-blue rounded-xl px-8 my-16 text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">
          Ready to Make Your Event Unforgettable?
        </h2>
        <p className="text-xl mb-8 text-secondary-blue">
          Book now and get free delivery within Loop 1604!
        </p>
        <button className="bg-white text-primary-blue px-8 py-3 rounded-lg font-semibold hover:bg-secondary-blue transition inline-flex items-center gap-2">
          Contact Now
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </>
  );
};

export default HomePage;
