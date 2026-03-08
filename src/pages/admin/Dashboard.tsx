import React, { useEffect, useState } from 'react';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Car, MessageSquare, Users, DollarSign } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    activeListings: 0,
    totalInquiries: 0,
    unreadInquiries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const carsColl = collection(db, 'cars');
        const inquiriesColl = collection(db, 'inquiries');

        const totalCarsSnap = await getCountFromServer(carsColl);
        const activeCarsSnap = await getCountFromServer(query(carsColl, where('status', '==', 'Available')));
        const totalInquiriesSnap = await getCountFromServer(inquiriesColl);
        const unreadInquiriesSnap = await getCountFromServer(query(inquiriesColl, where('status', '==', 'New')));

        setStats({
          totalCars: totalCarsSnap.data().count,
          activeListings: activeCarsSnap.data().count,
          totalInquiries: totalInquiriesSnap.data().count,
          unreadInquiries: unreadInquiriesSnap.data().count,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-white">Loading stats...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <Car size={24} />
            </div>
            <span className="text-xs font-bold bg-zinc-800 text-gray-400 px-2 py-1 rounded">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{stats.totalCars}</h3>
          <p className="text-gray-400 text-sm">Total Vehicles</p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
              <DollarSign size={24} />
            </div>
            <span className="text-xs font-bold bg-zinc-800 text-gray-400 px-2 py-1 rounded">Active</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{stats.activeListings}</h3>
          <p className="text-gray-400 text-sm">Active Listings</p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
              <MessageSquare size={24} />
            </div>
            <span className="text-xs font-bold bg-zinc-800 text-gray-400 px-2 py-1 rounded">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{stats.totalInquiries}</h3>
          <p className="text-gray-400 text-sm">Customer Inquiries</p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
              <MessageSquare size={24} />
            </div>
            <span className="text-xs font-bold bg-zinc-800 text-gray-400 px-2 py-1 rounded">New</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{stats.unreadInquiries}</h3>
          <p className="text-gray-400 text-sm">Unread Messages</p>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
        <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="text-gray-400 text-center py-12">
          Activity feed coming soon...
        </div>
      </div>
    </div>
  );
};
