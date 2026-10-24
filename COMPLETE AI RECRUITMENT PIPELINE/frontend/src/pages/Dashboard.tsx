import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Users, FileText, CheckCircle, TrendingUp, Briefcase, Mail, Calendar as CalendarIcon, MessageSquare } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../lib/utils';

export default function Dashboard() {
  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await api.get('/analytics/dashboard');
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

  const statusData = analytics?.applicationsByStatus?.map((item: any) => ({
    name: item.status,
    value: parseInt(item.count)
  })) || [];

  const COLORS = ['#FF6B4A', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

  const stats = [
    {
      name: 'Applications',
      value: analytics?.totalApplications || 0,
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      name: 'Shortlisted',
      value: statusData.find((s: any) => s.name === 'screening_completed')?.value || 0,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      name: 'Hired',
      value: statusData.find((s: any) => s.name === 'hired')?.value || 0,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      name: 'Active Jobs',
      value: analytics?.activeJobs || 0,
      icon: Briefcase,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-secondary-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your recruitment overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Roles */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-bold mb-4">Active Roles</h2>
          <div className="space-y-4">
            {jobs?.slice(0, 5).map((job: any) => (
              <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-secondary-800">{job.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatCurrency(job.salary_min)} - {formatCurrency(job.salary_max)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{job.applicant_count || 0}</p>
                  <p className="text-xs text-gray-600">applicants</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hiring Insights */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Hiring Insights</h2>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Avg. Time to Hire</span>
              <span className="font-semibold">{Math.round(analytics?.averageTimeToHire || 0)} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Integrations</h2>
        <div className="flex gap-4 flex-wrap">
          {[
            { name: 'Gmail', icon: Mail, color: 'bg-red-500' },
            { name: 'Calendar', icon: CalendarIcon, color: 'bg-blue-500' },
            { name: 'Slack', icon: MessageSquare, color: 'bg-purple-500' }
          ].map((integration) => {
            const Icon = integration.icon;
            return (
              <div key={integration.name} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                <div className={`${integration.color} p-2 rounded`}>
                  <Icon className="text-white" size={16} />
                </div>
                <span className="text-sm font-medium">{integration.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
