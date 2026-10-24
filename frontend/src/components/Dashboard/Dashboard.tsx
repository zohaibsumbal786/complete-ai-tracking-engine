import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, closestCorners } from '@dnd-kit/core';
import { sopAPI } from '../../services/api';
import type { SOPUpdate } from '../../types';
import KanbanColumn from './KanbanColumn';
import SOPCard from './SOPCard';

type Status = 'to_update' | 'in_progress' | 'in_review' | 'done';

const COLUMNS: Array<{ id: Status; title: string; color: string }> = [
  { id: 'to_update', title: 'To Update', color: 'bg-red-50 border-red-200' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'in_review', title: 'In Review', color: 'bg-blue-50 border-blue-200' },
  { id: 'done', title: 'Done', color: 'bg-green-50 border-green-200' },
];

export default function Dashboard() {
  const [sops, setSops] = useState<Record<Status, SOPUpdate[]>>({
    to_update: [],
    in_progress: [],
    in_review: [],
    done: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    loadSOPs();
  }, []);

  const loadSOPs = async () => {
    try {
      const data = await sopAPI.getByStatus();
      setSops(data);
    } catch (error) {
      console.error('Failed to load SOPs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const sopId = active.id as number;
    const newStatus = over.id as Status;

    // Find the SOP being moved
    let sop: SOPUpdate | undefined;
    let oldStatus: Status | undefined;

    for (const [status, items] of Object.entries(sops)) {
      const found = items.find(item => item.id === sopId);
      if (found) {
        sop = found;
        oldStatus = status as Status;
        break;
      }
    }

    if (!sop || !oldStatus || oldStatus === newStatus) return;

    // Optimistic update
    setSops(prev => ({
      ...prev,
      [oldStatus]: prev[oldStatus].filter(item => item.id !== sopId),
      [newStatus]: [...prev[newStatus], { ...sop, status: newStatus }],
    }));

    // Update on server
    try {
      await sopAPI.update(sopId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update SOP:', error);
      // Revert on error
      loadSOPs();
    }
  };

  const activeSOP = activeId
    ? Object.values(sops).flat().find(sop => sop.id === activeId)
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">SOP Updates Dashboard</h2>
        <button
          onClick={loadSOPs}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLUMNS.map(column => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              sops={sops[column.id]}
            />
          ))}
        </div>

        <DragOverlay>
          {activeSOP ? (
            <div className="rotate-3 opacity-90">
              <SOPCard sop={activeSOP} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
