'use client';

import { useState } from 'react';
import { updateOrderStatus, OrderStatus } from '@/actions/admin.actions';

const statuses: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

export default function StatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    setLoading(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      setStatus(newStatus);
    } catch (err) {
      alert('Failed to update status');
      setStatus(currentStatus); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className="border border-brand-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
    >
      {statuses.map((s) => (
        <option key={s} value={s} className="capitalize">{s}</option>
      ))}
    </select>
  );
}
