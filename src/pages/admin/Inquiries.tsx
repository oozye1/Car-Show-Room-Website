import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Inquiry } from '../../types';
import { Mail, Check, Archive, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const AdminInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const fetchedInquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Inquiry[];
      setInquiries(fetchedInquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: Inquiry['status']) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), { status: newStatus });
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Inquiries</h1>

      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black text-gray-400 text-sm uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading inquiries...</td></tr>
              ) : inquiries.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No inquiries found.</td></tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        inquiry.status === 'New' ? 'bg-blue-500/20 text-blue-500' :
                        inquiry.status === 'Read' ? 'bg-yellow-500/20 text-yellow-500' :
                        inquiry.status === 'Replied' ? 'bg-green-500/20 text-green-500' :
                        'bg-gray-500/20 text-gray-500'
                      }`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{inquiry.name}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{inquiry.email}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm max-w-xs truncate" title={inquiry.message}>
                      {inquiry.message}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {inquiry.status === 'New' && (
                        <button
                          onClick={() => handleStatusChange(inquiry.id, 'Read')}
                          className="p-2 text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-colors"
                          title="Mark as Read"
                        >
                          <Clock size={18} />
                        </button>
                      )}
                      {inquiry.status !== 'Replied' && (
                        <button
                          onClick={() => handleStatusChange(inquiry.id, 'Replied')}
                          className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                          title="Mark as Replied"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      {inquiry.status !== 'Archived' && (
                        <button
                          onClick={() => handleStatusChange(inquiry.id, 'Archived')}
                          className="p-2 text-gray-500 hover:bg-gray-500/10 rounded-lg transition-colors"
                          title="Archive"
                        >
                          <Archive size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
