import React from "react";
import ContactForm from "./ContactForm";

const ContactPage: React.FC = () => {
  return (
    <div className="w-full bg-secondary-blue/5 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6">
              Get in <span className="bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to make your event unforgettable? Let's start planning your perfect party!
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
            <div className="grid md:grid-cols-2 gap-12 mb-8">
              <div className="space-y-6">
                <div className="bg-secondary-blue/5 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-primary-purple mb-2">📍 Location</h3>
                  <p className="text-gray-600">San Antonio, TX</p>
                </div>
                
                <div className="bg-secondary-blue/5 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-primary-purple mb-2">📞 Phone</h3>
                  <p className="text-gray-600">512-210-0194</p>
                </div>
                
                <div className="bg-secondary-blue/5 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-primary-purple mb-2">⏰ Hours</h3>
                  <p className="text-gray-600">Monday - Sunday: 8am - 8pm</p>
                </div>

                <div className="bg-gradient-to-r from-blue-400 to-purple-600 text-white p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">🎉 Free Delivery</h3>
                  <p>Within Loop 1604 for all rentals!</p>
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
