import { useState } from "react";
import axios from "axios";
import { getApiUrl } from "../utils/env";

interface FormData {
  bouncer: string;
  email: string;
  partyDate: string;
  partyZipCode: string;
  phone: string;
  message: string;
  sourcePage: string;
  tablesChairs: boolean;
  generator: boolean;
  popcornMachine: boolean;
  cottonCandyMachine: boolean;
  snowConeMachine: boolean;
  pettingZoo: boolean;
  ponyRides: boolean;
  dj: boolean;
  overnight: boolean;
}

interface FormErrors {
  bouncer?: string;
  email?: string;
  partyDate?: string;
  partyZipCode?: string;
  phone?: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    bouncer: "",
    email: "",
    partyDate: "",
    partyZipCode: "",
    phone: "",
    message: "",
    sourcePage: "contact",
    tablesChairs: false,
    generator: false,
    popcornMachine: false,
    cottonCandyMachine: false,
    snowConeMachine: false,
    pettingZoo: false,
    ponyRides: false,
    dj: false,
    overnight: false,
  });

  const API_URL = getApiUrl();

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    const phoneRegex = /^(\+?[\d\s\-()]{7,16})?$/;

    if (!formData.bouncer) newErrors.bouncer = "Name is required";

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.partyDate) {
      newErrors.partyDate = "Party date is required";
    }

    if (!formData.partyZipCode) {
      newErrors.partyZipCode = "Party zip code is required";
    }

    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await axios.post(`${API_URL}/api/v1/contacts`, formData);
      setSubmitStatus("success");
      setFormData({
        bouncer: "",
        email: "",
        partyDate: "",
        partyZipCode: "",
        phone: "",
        message: "",
        sourcePage: "contact",
        tablesChairs: false,
        generator: false,
        popcornMachine: false,
        cottonCandyMachine: false,
        snowConeMachine: false,
        pettingZoo: false,
        ponyRides: false,
        dj: false,
        overnight: false,
      });
    } catch (error) {
      setSubmitStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 space-y-4 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center text-primary-purple mb-6">
        🎉 Let's Plan Your Perfect Party! 🎈
      </h2>

      {submitStatus === "success" && (
        <div className="bg-green-100 text-green-700 p-3 rounded text-center">
          🎊 Woohoo! Your message is on its way! We'll be in touch super soon!
          🌟
        </div>
      )}

      {submitStatus === "error" && (
        <div className="bg-red-100 text-red-700 p-3 rounded text-center">
          🎪 Oops! Something went wrong. Let's try that again! 🎪
        </div>
      )}

      <div>
        <label
          htmlFor="bouncer"
          className="block text-sm font-medium text-gray-700"
        >
          👤 Your Name
        </label>
        <input
          type="text"
          id="bouncer"
          name="bouncer"
          value={formData.bouncer}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple"
          placeholder="What should we call you?"
        />
        {errors.bouncer && (
          <p className="text-red-500 text-sm mt-1">{errors.bouncer}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          📧 Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple"
          placeholder="Where should we send the party details?"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="partyDate"
          className="block text-sm font-medium text-gray-700"
        >
          📅 When's the Big Day?
        </label>
        <input
          type="date"
          id="partyDate"
          name="partyDate"
          value={formData.partyDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple"
        />
        {errors.partyDate && (
          <p className="text-red-500 text-sm mt-1">{errors.partyDate}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="partyZipCode"
          className="block text-sm font-medium text-gray-700"
        >
          📍 Party Location (Zip Code)
        </label>
        <input
          type="text"
          id="partyZipCode"
          name="partyZipCode"
          value={formData.partyZipCode}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple"
          placeholder="Where's the party at?"
        />
        {errors.partyZipCode && (
          <p className="text-red-500 text-sm mt-1">{errors.partyZipCode}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          📞 Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple"
          placeholder="Best number to reach you"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center text-primary-purple">
          ✨ Make Your Party Extra Special! ✨
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              id="tablesChairs"
              name="tablesChairs"
              checked={formData.tablesChairs}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary-purple focus:ring-primary-purple"
            />
            <label htmlFor="tablesChairs" className="text-sm text-gray-700">
              🪑 Tables & Chairs
            </label>
          </div>

          <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              id="generator"
              name="generator"
              checked={formData.generator}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary-purple focus:ring-primary-purple"
            />
            <label htmlFor="generator" className="text-sm text-gray-700">
              ⚡ Generator
            </label>
          </div>

          <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              id="popcornMachine"
              name="popcornMachine"
              checked={formData.popcornMachine}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary-purple focus:ring-primary-purple"
            />
            <label htmlFor="popcornMachine" className="text-sm text-gray-700">
              🍿 Popcorn Machine
            </label>
          </div>

          <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              id="cottonCandyMachine"
              name="cottonCandyMachine"
              checked={formData.cottonCandyMachine}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary-purple focus:ring-primary-purple"
            />
            <label
              htmlFor="cottonCandyMachine"
              className="text-sm text-gray-700"
            >
              🍭 Cotton Candy
            </label>
          </div>

          <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              id="snowConeMachine"
              name="snowConeMachine"
              checked={formData.snowConeMachine}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary-purple focus:ring-primary-purple"
            />
            <label htmlFor="snowConeMachine" className="text-sm text-gray-700">
              🧊 Snow Cones
            </label>
          </div>

          {/* <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              id="pettingZoo"
              name="pettingZoo"
              checked={formData.pettingZoo}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary-purple focus:ring-primary-purple"
            />
            <label htmlFor="pettingZoo" className="text-sm text-gray-700">
              🦒 Petting Zoo
            </label>
          </div>

          <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              id="ponyRides"
              name="ponyRides"
              checked={formData.ponyRides}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary-purple focus:ring-primary-purple"
            />
            <label htmlFor="ponyRides" className="text-sm text-gray-700">
              🐎 Pony Rides
            </label>
          </div>

          <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              id="dj"
              name="dj"
              checked={formData.dj}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary-purple focus:ring-primary-purple"
            />
            <label htmlFor="dj" className="text-sm text-gray-700">
              🎵 DJ Services
            </label>
          </div> */}

          <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              id="overnight"
              name="overnight"
              checked={formData.overnight}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary-purple focus:ring-primary-purple"
            />
            <label htmlFor="overnight" className="text-sm text-gray-700">
              🌙 Overnight Rental
            </label>
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          💭 Tell Us About Your Dream Party!
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple"
          placeholder="Share your party vision with us..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-primary-purple text-white py-3 px-4 rounded-md hover:bg-primary-blue transition-all transform hover:scale-105 font-semibold text-lg"
      >
        🎪 Let's Make Magic Happen! 🎪
      </button>
    </form>
  );
};

export default ContactForm;
