'use client';

import { useState } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'in-progress' | 'completed';
  createdAt: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      message: 'Interested in booking a bounce house for next weekend.',
      status: 'new',
      createdAt: '2024-01-20T10:30:00Z',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '(555) 987-6543',
      message: 'Looking for party package options for a birthday.',
      status: 'in-progress',
      createdAt: '2024-01-19T15:45:00Z',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '(555) 456-7890',
      message: 'Need information about water slide rentals.',
      status: 'completed',
      createdAt: '2024-01-18T09:15:00Z',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateStatus = async (id: string, newStatus: 'new' | 'in-progress' | 'completed') => {
    setIsLoading(true);
    // TODO: Implement actual API call to update status
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, status: newStatus } : contact
    ));
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this contact request?')) {
      return;
    }
    setIsLoading(true);
    // TODO: Implement actual delete API call
    setContacts(contacts.filter(contact => contact.id !== id));
    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Contact Requests</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all contact requests including customer details and current status.
          </p>
        </div>
      </div>
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Contact Info
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Message
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {contacts.map((contact) => (
                    <tr key={contact.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">{contact.name}</div>
                        <div className="text-gray-500">{contact.email}</div>
                        <div className="text-gray-500">{contact.phone}</div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="max-w-xs overflow-hidden text-ellipsis">
                          {contact.message}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <select
                          value={contact.status}
                          onChange={(e) => handleUpdateStatus(contact.id, e.target.value as 'new' | 'in-progress' | 'completed')}
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(contact.status)}`}
                          disabled={isLoading}
                        >
                          <option value="new">New</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatDate(contact.createdAt)}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isLoading}
                        >
                          {isLoading ? <LoadingSpinner className="w-4 h-4" /> : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
