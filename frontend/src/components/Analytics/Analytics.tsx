import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react';
import { analyticsAPI } from '../../services/api';
import type { Stats } from '../../types';

export default function Analytics() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await analyticsAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-500">No data available</div>
    );
  }

  const weeklyData = stats.weekly.map(w => ({
    week: new Date(w.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    queries: parseInt(w.query_count),
    confidence: parseFloat(w.avg_confidence),
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Queries</p>
              <p className="text-3xl font-bold text-gray-900">
                {parseInt(stats.overall.total_queries).toLocaleString()}
              </p>
            </div>
            <MessageSquare className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Confidence</p>
              <p className="text-3xl font-bold text-gray-900">
                {parseFloat(stats.overall.avg_confidence).toFixed(1)}%
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Low Confidence</p>
              <p className="text-3xl font-bold text-gray-900">
                {parseInt(stats.overall.low_confidence_count).toLocaleString()}
              </p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Query Volume Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Weekly Query Volume
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="queries" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Confidence Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Confidence Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="space-y-3">
          {parseFloat(stats.overall.avg_confidence) < 70 && (
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">Low Average Confidence</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Your documentation may need updates to improve answer quality.
                </p>
              </div>
            </div>
          )}

          {parseInt(stats.overall.low_confidence_count) > 10 && (
            <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">High Number of Low Confidence Queries</p>
                <p className="text-sm text-red-700 mt-1">
                  {stats.overall.low_confidence_count} queries had confidence below 70%. Review these in the dashboard.
                </p>
              </div>
            </div>
          )}

          {parseFloat(stats.overall.avg_confidence) >= 80 && (
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Excellent Documentation Quality</p>
                <p className="text-sm text-green-700 mt-1">
                  Your documentation is performing well with high confidence scores.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
