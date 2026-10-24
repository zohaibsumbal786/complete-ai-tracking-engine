import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Calendar, Plus, Video } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function Interviews() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    applicationId: '',
    scheduledAt: '',
    meetingLink: ''
  });

  const queryClient = useQueryClient();

  const { data: interviews, isLoading } = useQuery({
    queryKey: ['interviews'],
    queryFn: async () => {
      const res = await api.get('/interviews');
      return res.data;
    }
  });

  const { data: applications } = useQuery({
    queryKey: ['applications-for-interview'],
    queryFn: async () => {
      const res = await api.get('/applications?status=screening_completed');
      return res.data;
    }
  });

  const scheduleMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/interviews/schedule', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      setShowModal(false);
      setFormData({ applicationId: '', scheduledAt: '', meetingLink: '' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleMutation.mutate(formData);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-800">Interviews</h1>
          <p className="text-gray-600 mt-1">Schedule and manage interviews</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Schedule Interview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {interviews?.map((interview: any) => (
          <div key={interview.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Calendar className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-secondary-800">{interview.candidate_name}</h3>
                  <p className="text-sm text-gray-600">{interview.job_title}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                interview.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {interview.status}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={16} />
                <span>{new Date(interview.scheduled_at).toLocaleString()}</span>
              </div>
              {interview.meeting_link && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Video size={16} />
                  <a
                    href={interview.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Join Meeting
                  </a>
                </div>
              )}
              {interview.interviewer_name && (
                <p className="text-gray-600">Interviewer: {interview.interviewer_name}</p>
              )}
            </div>

            {interview.notes && (
              <div className="bg-gray-50 p-3 rounded text-sm">
                <p className="font-medium mb-1">Notes:</p>
                <p className="text-gray-600">{interview.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {interviews?.length === 0 && (
        <div className="card text-center py-12">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">No interviews scheduled yet</p>
        </div>
      )}

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Schedule Interview</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Candidate</label>
                <select
                  value={formData.applicationId}
                  onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select candidate...</option>
                  {applications?.map((app: any) => (
                    <option key={app.id} value={app.id}>
                      {app.candidate_name} - {app.job_title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Meeting Link</label>
                <input
                  type="url"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
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
                  disabled={scheduleMutation.isPending}
                  className="flex-1 btn btn-primary"
                >
                  {scheduleMutation.isPending ? 'Scheduling...' : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
