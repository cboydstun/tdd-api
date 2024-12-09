import { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl } from "../utils/env";

interface Specification {
  name: string;
  value: string;
  _id: string;
}

interface Bouncer {
  _id: string;
  name: string;
  images: Array<{ url: string; alt: string }>;
  specifications: Specification[];
}

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
  overnight: boolean;
  consentToContact: boolean;
}

interface FormErrors {
  bouncer?: string;
  email?: string;
  partyDate?: string;
  partyZipCode?: string;
  phone?: string;
}

interface ContactFormProps {
  initialBouncerId?: string;
}

const ContactForm = ({ initialBouncerId }: ContactFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    bouncer: initialBouncerId || "",
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
    overnight: false,
    consentToContact: false,
  });

  const [bouncers, setBouncers] = useState<Bouncer[]>([]);
  const [selectedBouncerImage, setSelectedBouncerImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const API_URL = getApiUrl();

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  useEffect(() => {
    const fetchBouncers = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const response = await axios.get(`${API_URL}/api/v1/products`);

        const filteredBouncers = response.data.filter((product: Bouncer) => {
          const typeSpec = product.specifications?.find(
            (spec) =>
              spec.name === "Type" &&
              (spec.value === "WET" || spec.value === "DRY")
          );
          return typeSpec !== undefined;
        });

        setBouncers(filteredBouncers);

        // Set selected bouncer image if initialBouncerId is provided
        if (initialBouncerId) {
          const selectedBouncer = filteredBouncers.find(
            (b: Bouncer) => b._id === initialBouncerId
          );
          if (selectedBouncer?.images[0]?.url) {
            setSelectedBouncerImage(selectedBouncer.images[0].url);
          }
        }
      } catch (error) {
        console.error("Error fetching bouncers:", error);
        setLoadError("Failed to load bouncers. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBouncers();
  }, [API_URL, initialBouncerId]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    const phoneRegex = /^(\+?[\d\s\-()]{7,16})?$/;

    if (!formData.bouncer) newErrors.bouncer = "Please select a bouncer";

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

    if (!validateForm() || !formData.consentToContact) return;

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
        overnight: false,
        consentToContact: false,
      });
      setSelectedBouncerImage("");
    } catch (error) {
      setSubmitStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "bouncer") {
      const selectedBouncer = bouncers.find((b: Bouncer) => b._id === value);
      setSelectedBouncerImage(selectedBouncer?.images[0]?.url || "");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[800px] mx-auto bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-secondary-blue/20 shadow-lg p-8 space-y-6"
    >
      {/* Status Messages */}
      {submitStatus === "success" && (
        <div className="bg-green-100 text-green-700 p-4 rounded-xl text-center text-lg animate-fade-in">
          🎊 Woohoo! Your message is on its way! We'll be in touch super soon!
          🌟
        </div>
      )}

      {submitStatus === "error" && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl text-center text-lg animate-fade-in">
          🎪 Oops! Something went wrong. Let's try that again! 🎪
        </div>
      )}

      {/* Bouncer Selection */}
      <div>
        <label
          htmlFor="bouncer"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          🎪 Select a Bouncer
        </label>
        {isLoading ? (
          <div className="text-gray-500">Loading bouncers...</div>
        ) : loadError ? (
          <div className="text-red-500">{loadError}</div>
        ) : (
          <select
            id="bouncer"
            name="bouncer"
            value={formData.bouncer}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-secondary-blue/20 shadow-sm focus:border-primary-purple focus:ring-primary-purple p-3"
          >
            <option value="">Choose a bouncer...</option>
            {bouncers.map((bouncer) => {
              const type = bouncer.specifications.find(
                (spec) => spec.name === "Type"
              )?.value;
              return (
                <option key={bouncer._id} value={bouncer._id}>
                  {bouncer.name} ({type})
                </option>
              );
            })}
          </select>
        )}
        {errors.bouncer && (
          <p className="text-red-500 text-sm mt-1">{errors.bouncer}</p>
        )}
      </div>

      {/* Selected Bouncer Image */}
      {selectedBouncerImage && (
        <div className="rounded-xl overflow-hidden shadow-md">
          <img
            src={selectedBouncerImage}
            alt="Selected bouncer"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Contact Details */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            📧 Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-secondary-blue/20 shadow-sm focus:border-primary-purple focus:ring-primary-purple p-3"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="partyDate"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            📅 When's the Big Day?
          </label>
          <input
            type="date"
            id="partyDate"
            name="partyDate"
            value={formData.partyDate}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-secondary-blue/20 shadow-sm focus:border-primary-purple focus:ring-primary-purple p-3"
          />
          {errors.partyDate && (
            <p className="text-red-500 text-sm mt-1">{errors.partyDate}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="partyZipCode"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            📍 Party Location (Zip Code)
          </label>
          <input
            type="text"
            id="partyZipCode"
            name="partyZipCode"
            value={formData.partyZipCode}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-secondary-blue/20 shadow-sm focus:border-primary-purple focus:ring-primary-purple p-3"
            placeholder="Where's the party at?"
          />
          {errors.partyZipCode && (
            <p className="text-red-500 text-sm mt-1">{errors.partyZipCode}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            📞 Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-secondary-blue/20 shadow-sm focus:border-primary-purple focus:ring-primary-purple p-3"
            placeholder="Best number to reach you"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Extras Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center text-primary-purple">
          Make Your Party Extra Special! ✨
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "tablesChairs", label: "🪑 Tables & Chairs" },
            { id: "generator", label: "⚡ Generator" },
            { id: "popcornMachine", label: "🍿 Popcorn Machine" },
            { id: "cottonCandyMachine", label: "🍭 Cotton Candy" },
            { id: "snowConeMachine", label: "🧊 Snow Cones" },
            { id: "overnight", label: "🌙 Overnight Rental" },
          ].map(({ id, label }) => (
            <div
              key={id}
              className="flex items-center space-x-2 bg-secondary-blue/5 p-3 rounded-lg hover:bg-secondary-blue/10 transition-colors cursor-pointer"
              onClick={() =>
                handleChange({
                  target: {
                    type: "checkbox",
                    name: id,
                    checked: !formData[id as keyof typeof formData],
                  },
                } as React.ChangeEvent<HTMLInputElement>)
              }
            >
              <input
                type="checkbox"
                id={id}
                name={id}
                checked={formData[id as keyof typeof formData] as boolean}
                onChange={handleChange}
                className="rounded border-2 border-secondary-blue/20 text-primary-purple focus:ring-primary-purple"
              />
              <label
                htmlFor={id}
                className="text-sm text-gray-700 cursor-pointer"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Message Field */}
      <div>
        <label
          htmlFor="message"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          💭 Tell Us About Your Dream Party!
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-lg border-2 border-secondary-blue/20 shadow-sm focus:border-primary-purple focus:ring-primary-purple p-3"
          placeholder="Share your party vision with us..."
        />
      </div>

      {/* Consent Checkbox */}
      <div className="bg-secondary-blue/5 p-4 rounded-lg">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            id="consentToContact"
            name="consentToContact"
            checked={formData.consentToContact}
            onChange={handleChange}
            className="mt-1 rounded border-2 border-secondary-blue/20 text-primary-purple focus:ring-primary-purple"
          />
          <span className="text-sm text-gray-700">
            I agree to calls, texts, and emails about my party rental inquiry 📱
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!formData.consentToContact}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 ${
          formData.consentToContact
            ? "bg-gradient-to-r from-blue-400 to-purple-600 text-white hover:from-blue-500 hover:to-purple-700 shadow-md hover:shadow-lg"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Book Now 🎉
      </button>
    </form>
  );
};

export default ContactForm;
