import { useState, useEffect } from 'react';
import { Contact } from '../../types/contact';

interface ContactFormProps {
  onSubmit: (data: Partial<Contact>) => Promise<void>;
  onCancel: () => void;
  initialData?: Contact;
}

export default function ContactForm({ onSubmit, onCancel, initialData }: ContactFormProps) {
  const [formData, setFormData] = useState<Partial<Contact>>({
    bouncer: '',
    email: '',
    partyDate: '',
    partyZipCode: '',
    phone: '',
    tablesChairs: false,
    generator: false,
    popcornMachine: false,
    cottonCandyMachine: false,
    snowConeMachine: false,
    pettingZoo: false,
    ponyRides: false,
    dj: false,
    overnight: false,
    message: '',
    confirmed: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        partyDate: new Date(initialData.partyDate).toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="bouncer" className="block text-sm font-medium text-gray-700">
            Bouncer
          </label>
          <input
            type="text"
            name="bouncer"
            id="bouncer"
            value={formData.bouncer}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="partyDate" className="block text-sm font-medium text-gray-700">
            Party Date
          </label>
          <input
            type="date"
            name="partyDate"
            id="partyDate"
            value={formData.partyDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="partyZipCode" className="block text-sm font-medium text-gray-700">
            Zip Code
          </label>
          <input
            type="text"
            name="partyZipCode"
            id="partyZipCode"
            value={formData.partyZipCode}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="tablesChairs"
            id="tablesChairs"
            checked={formData.tablesChairs}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary-purple focus:ring-primary-purple"
          />
          <label htmlFor="tablesChairs" className="ml-2 block text-sm text-gray-700">
            Tables & Chairs
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="generator"
            id="generator"
            checked={formData.generator}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary-purple focus:ring-primary-purple"
          />
          <label htmlFor="generator" className="ml-2 block text-sm text-gray-700">
            Generator
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="popcornMachine"
            id="popcornMachine"
            checked={formData.popcornMachine}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary-purple focus:ring-primary-purple"
          />
          <label htmlFor="popcornMachine" className="ml-2 block text-sm text-gray-700">
            Popcorn Machine
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="cottonCandyMachine"
            id="cottonCandyMachine"
            checked={formData.cottonCandyMachine}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary-purple focus:ring-primary-purple"
          />
          <label htmlFor="cottonCandyMachine" className="ml-2 block text-sm text-gray-700">
            Cotton Candy Machine
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="snowConeMachine"
            id="snowConeMachine"
            checked={formData.snowConeMachine}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary-purple focus:ring-primary-purple"
          />
          <label htmlFor="snowConeMachine" className="ml-2 block text-sm text-gray-700">
            Snow Cone Machine
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="pettingZoo"
            id="pettingZoo"
            checked={formData.pettingZoo}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary-purple focus:ring-primary-purple"
          />
          <label htmlFor="pettingZoo" className="ml-2 block text-sm text-gray-700">
            Petting Zoo
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="ponyRides"
            id="ponyRides"
            checked={formData.ponyRides}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary-purple focus:ring-primary-purple"
          />
          <label htmlFor="ponyRides" className="ml-2 block text-sm text-gray-700">
            Pony Rides
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="dj"
            id="dj"
            checked={formData.dj}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary-purple focus:ring-primary-purple"
          />
          <label htmlFor="dj" className="ml-2 block text-sm text-gray-700">
            DJ
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="overnight"
            id="overnight"
            checked={formData.overnight}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary-purple focus:ring-primary-purple"
          />
          <label htmlFor="overnight" className="ml-2 block text-sm text-gray-700">
            Overnight
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="confirmed"
            id="confirmed"
            checked={formData.confirmed}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary-purple focus:ring-primary-purple"
          />
          <label htmlFor="confirmed" className="ml-2 block text-sm text-gray-700">
            Confirmed
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          rows={3}
          value={formData.message}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-primary-purple px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2"
        >
          Save
        </button>
      </div>
    </form>
  );
}
