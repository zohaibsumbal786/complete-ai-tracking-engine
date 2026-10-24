import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AlertCircle, MessageSquare, TrendingUp, User } from 'lucide-react';
import type { SOPUpdate } from '../../types';

interface Props {
  sop: SOPUpdate;
}

export default function SOPCard({ sop }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'text-green-600';
    if (confidence >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
    >
      {/* Priority Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(sop.priority)}`}>
          {sop.priority.toUpperCase()}
        </span>
        {sop.avg_confidence < 70 && (
          <AlertCircle className="w-4 h-4 text-red-500" />
        )}
      </div>

      {/* Title */}
      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {sop.title}
      </h4>

      {/* Description */}
      {sop.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {sop.description}
        </p>
      )}

      {/* Metrics */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center text-sm text-gray-600">
          <MessageSquare className="w-4 h-4 mr-2" />
          <span>{sop.question_count} questions</span>
        </div>
        <div className="flex items-center text-sm">
          <TrendingUp className="w-4 h-4 mr-2 text-gray-600" />
          <span className={getConfidenceColor(sop.avg_confidence)}>
            {sop.avg_confidence.toFixed(1)}% avg confidence
          </span>
        </div>
      </div>

      {/* Assignee */}
      {sop.assignee && (
        <div className="flex items-center text-sm text-gray-600 pt-3 border-t border-gray-100">
          <User className="w-4 h-4 mr-2" />
          <span>{sop.assignee}</span>
        </div>
      )}
    </div>
  );
}
