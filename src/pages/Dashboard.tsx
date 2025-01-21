import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Store, User } from 'lucide-react';
import api from '../utils/api';
import type { Vendor } from '../types/vendor';

interface DashboardProps {
  setIsAuthenticated: (value: boolean) => void;
}

export default function Dashboard({ setIsAuthenticated }: DashboardProps) {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setVendor(data);
      } catch (error) {
        console.error('Failed to fetch vendor data:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Store className="w-8 h-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Vendor Portal
              </span>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-6">
              <User className="w-12 h-12 text-indigo-600" />
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {vendor?.storeName}
                </h2>
                <p className="text-gray-500">{vendor?.email}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Store ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{vendor?._id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(vendor?.createdAt || '').toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}