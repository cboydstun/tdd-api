import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AdminPanel() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Dashboard Cards */}
              <div className="bg-primary-purple bg-opacity-10 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-primary-purple mb-2">
                  Users
                </h2>
                <p className="text-gray-600">
                  Manage user accounts and permissions
                </p>
              </div>

              <div className="bg-primary-blue bg-opacity-10 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-primary-blue mb-2">
                  Content
                </h2>
                <p className="text-gray-600">
                  Manage blog posts and website content
                </p>
              </div>

              <div className="bg-secondary-indigo bg-opacity-10 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-secondary-indigo mb-2">
                  Settings
                </h2>
                <p className="text-gray-600">
                  Configure website settings and preferences
                </p>
              </div>
            </div>

            {/* Quick Actions Section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-4">
                <button className="w-full sm:w-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-purple hover:bg-primary-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple">
                  Create New Post
                </button>
                <button className="ml-0 sm:ml-4 mt-4 sm:mt-0 w-full sm:w-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-purple bg-primary-purple bg-opacity-10 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
