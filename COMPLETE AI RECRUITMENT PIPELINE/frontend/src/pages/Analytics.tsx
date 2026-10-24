import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Clock, Target } from 'lucide-react';

export default function Analytics() {
  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await api.get('/analytics/dashboard');
      return res.data;
    }
  });

  const applicationsByJob = analytics?.applicationsByJob?.map((item: any) => ({
    name: item.title,
    applications: parseInt(item.count)
  })) || [];

  const metrics = [
    {
      name: 'Total Applications',
      value: analytics?.totalApplications || 0,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Avg. Time to Hire',
      value: `${Math.round(analytics?.averageTimeToHire || 0)} days`,
      icon: Clock,
      color: 'bg-green-500'
    },
    {
      name: 'Active Jobs',
      value: analytics?.activeJobs || 0,
      icon: Target,
      color: 'bg-purple-500'
    },
    {
      name: 'Conversion Rate',
      value: analytics?.totalApplications > 0 
        ? `${Math.round((analytics.applicationsByStatus.find((s: any) => s.status === 'hired')?.count || 0) / analytics.totalApplications * 100)}%`
        : '0%',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-800">Analytics</h1>
        <p className="text-gray-600 mt-1">Recruitment insights and metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.name}</p>
                  <p className="text-2xl font-bold mt-2">{metric.value}</p>
                </div>
                <div className={`${metric.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Applications by Job</h2>
        {applicationsByJob.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={applicationsByJob}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="applications" fill="#FF6B4A" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No data available</p>
        )}
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Recent Applications</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Candidate</th>
                <th className="text-left py-3 px-4 font-semibold">Job</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.recentApplications?.slice(0, 10).map((app: any) => (
                <tr key={app.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{app.candidate_name}</td>
                  <td className="py-3 px-4">{app.job_title}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(app.applied_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
