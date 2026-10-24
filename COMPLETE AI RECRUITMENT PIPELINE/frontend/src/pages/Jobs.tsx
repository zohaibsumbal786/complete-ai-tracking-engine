import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Plus, Briefcase, DollarSign, Users } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export default function Jobs() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salary_min: '',
    salary_max: '',
    requirements: { skills: [], experience: '' }
  });

  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await api.get('/jobs');
      return res.data;
    }
  });

  const createJobMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/jobs', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        salary_min: '',
        salary_max: '',
        requirements: { skills: [], experience: '' }
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createJobMutation.mutate({
      ...formData,
      salary_min: parseInt(formData.salary_min),
      salary_max: parseInt(formData.salary_max)
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-800">Job Positions</h1>
          <p className="text-gray-600 mt-1">Manage your open positions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Create Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs?.map((job: any) => (
          <div key={job.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <Briefcase className="text-primary" size={24} />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {job.status}
              </span>
            </div>

            <h3 className="text-lg font-bold text-secondary-800 mb-2">{job.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign size={16} />
                <span>{formatCurrency(job.salary_min)} - {formatCurrency(job.salary_max)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={16} />
                <span>{job.applicant_count || 0} applicants</span>
              </div>
            </div>

            <button className="w-full btn btn-secondary text-sm">
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Create Job Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Create New Job</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Job Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Min Salary</label>
                  <input
                    type="number"
                    value={formData.salary_min}
                    onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Salary</label>
                  <input
                    type="number"
                    value={formData.salary_max}
                    onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createJobMutation.isPending}
                  className="flex-1 btn btn-primary"
                >
                  {createJobMutation.isPending ? 'Creating...' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
