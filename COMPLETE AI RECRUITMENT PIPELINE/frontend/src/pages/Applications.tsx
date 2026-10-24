import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { formatDate } from '../lib/utils';

const STATUSES = ['applied', 'screening', 'interview_scheduled', 'offer', 'hired', 'rejected'];

export default function Applications() {
  const [selectedStatus, setSelectedStatus] = useState('');
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications', selectedStatus],
    queryFn: async () => {
      const params = selectedStatus ? `?status=${selectedStatus}` : '';
      const res = await api.get(`/applications${params}`);
      return res.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await api.put(`/applications/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    }
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      applied: 'bg-blue-100 text-blue-700',
      screening: 'bg-yellow-100 text-yellow-700',
      interview_scheduled: 'bg-purple-100 text-purple-700',
      offer: 'bg-green-100 text-green-700',
      hired: 'bg-green-200 text-green-800',
      rejected: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-800">Applications</h1>
        <p className="text-gray-600 mt-1">Track candidate applications</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedStatus('')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedStatus === '' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
              selectedStatus === status ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Candidate</th>
                <th className="text-left py-3 px-4 font-semibold">Job</th>
                <th className="text-left py-3 px-4 font-semibold">Applied</th>
                <th className="text-left py-3 px-4 font-semibold">Score</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications?.map((app: any) => (
                <tr key={app.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{app.candidate_name}</p>
                      <p className="text-sm text-gray-600">{app.candidate_email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{app.job_title}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{formatDate(app.applied_at)}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold">{app.screening_score || 0}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatusMutation.mutate({ id: app.id, status: e.target.value })}
                      className="px-3 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {applications?.length === 0 && (
            <p className="text-center py-8 text-gray-500">No applications found</p>
          )}
        </div>
      </div>
    </div>
  );
}
