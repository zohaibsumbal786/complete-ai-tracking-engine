import { useState } from 'react';
import { Send, AlertCircle, CheckCircle, Upload, FileText } from 'lucide-react';
import { queryAPI, documentAPI } from '../../services/api';
import type { QueryResult } from '../../types';

export default function QueryInterface() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const data = await queryAPI.ask(question);
      setResult(data);
    } catch (error) {
      console.error('Query error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    try {
      await documentAPI.upload(file);
      alert('Document uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document');
    } finally {
      setUploadingDoc(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'text-green-600 bg-green-50';
    if (confidence >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 70) return <CheckCircle className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Documentation</h2>
        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
          <div className="text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600">
              {uploadingDoc ? 'Uploading...' : 'Click to upload PDF or Markdown'}
            </span>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.md"
            onChange={handleFileUpload}
            disabled={uploadingDoc}
          />
        </label>
      </div>

      {/* Query Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ask a Question</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about your company's processes and SOPs..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Ask Question</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result Section */}
      {result && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 animate-fadeIn">
          {/* Confidence Badge */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Answer</h3>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getConfidenceColor(result.confidence)}`}>
              {getConfidenceIcon(result.confidence)}
              <span className="font-medium">{result.confidence.toFixed(1)}% Confidence</span>
            </div>
          </div>

          {/* Answer */}
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed">{result.answer}</p>
          </div>

          {/* Sources */}
          {result.sources.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Sources</h4>
              <div className="space-y-2">
                {result.sources.map((source, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-gray-900">{source.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{source.snippet}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Low Confidence Warning */}
          {result.confidence < 70 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Low Confidence Answer</p>
                <p className="text-sm text-yellow-700 mt-1">
                  This answer may need verification. Consider updating your documentation.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
