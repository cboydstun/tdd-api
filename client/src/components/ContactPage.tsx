import React from "react";
import ContactForm from "./ContactForm";

const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-primary-purple mb-8">
          Contact Us
        </h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Ready to make your event unforgettable? Get in touch with us today and
          let's start planning your perfect party!
        </p>
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactPage;
