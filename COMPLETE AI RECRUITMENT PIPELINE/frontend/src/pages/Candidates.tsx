import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import api from '../lib/api';
import { Upload, User, Mail, Phone, FileText } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function Candidates() {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedJob, setSelectedJob] = useState('');
  const queryClient = useQueryClient();

  const { data: candidates, isLoading } = useQuery({
    queryKey: ['candidates'],
    queryFn: async () => {
      const res = await api.get('/candidates');
      return res.data;
    }
  });

  const { data: jobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await api.get('/jobs');
      return res.data;
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/candidates/upload-cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      setShowUpload(false);
      setSelectedJob('');
    }
  });

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const formData = new FormData();
      formData.append('cv', acceptedFiles[0]);
      if (selectedJob) {
        formData.append('jobId', selectedJob);
      }
      uploadMutation.mutate(formData);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-800">Candidates</h1>
          <p className="text-gray-600 mt-1">Manage candidate profiles</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Upload size={20} />
          Upload CV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates?.map((candidate: any) => (
          <div key={candidate.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <User className="text-primary" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-secondary-800">{candidate.name}</h3>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${
                  candidate.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {candidate.status}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {candidate.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} />
                  <span className="truncate">{candidate.email}</span>
                </div>
              )}
              {candidate.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={16} />
                  <span>{candidate.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <FileText size={16} />
                <span>Applied {formatDate(candidate.created_at)}</span>
              </div>
            </div>

            <button className="w-full btn btn-secondary text-sm mt-4">
              View Profile
            </button>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Upload Candidate CV</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Job Position (Optional)</label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a job...</option>
                {jobs?.map((job: any) => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary-50' : 'border-gray-300 hover:border-primary'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto text-gray-400 mb-4" size={48} />
              {uploadMutation.isPending ? (
                <p className="text-gray-600">Uploading and parsing CV...</p>
              ) : isDragActive ? (
                <p className="text-gray-600">Drop the CV here...</p>
              ) : (
                <>
                  <p className="text-gray-600 mb-2">Drag & drop a CV here, or click to select</p>
                  <p className="text-sm text-gray-500">Supports PDF, DOC, DOCX, TXT</p>
                </>
              )}
            </div>

            {uploadMutation.isError && (
              <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                Upload failed. Please try again.
              </div>
            )}

            <button
              onClick={() => setShowUpload(false)}
              className="w-full btn btn-secondary mt-4"
              disabled={uploadMutation.isPending}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
