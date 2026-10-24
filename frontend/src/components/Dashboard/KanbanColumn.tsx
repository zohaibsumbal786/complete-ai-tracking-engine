import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { SOPUpdate } from '../../types';
import SOPCard from './SOPCard';

interface Props {
  id: string;
  title: string;
  color: string;
  sops: SOPUpdate[];
}

export default function KanbanColumn({ id, title, color, sops }: Props) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className={`rounded-lg border-2 ${color} p-4 min-h-[500px]`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="px-2 py-1 bg-white rounded-full text-sm font-medium text-gray-600">
          {sops.length}
        </span>
      </div>

      <SortableContext
        id={id}
        items={sops.map(sop => sop.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="space-y-3">
          {sops.map(sop => (
            <SOPCard key={sop.id} sop={sop} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
