import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, List, LayoutDashboard, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useOperationsStore, TaskStatus } from '@/store/operationsStore';
import { useAuth } from '@/auth/MockAuthProvider';

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'BACKLOG', title: 'BACKLOG' },
  { id: 'ASSIGNED', title: 'ASSIGNED' },
  { id: 'IN_PROGRESS', title: 'IN PROGRESS' },
  { id: 'REVIEW', title: 'REVIEW' },
  { id: 'COMPLETED', title: 'COMPLETED' },
];

export default function TaskManagement({ personalView = false }: { personalView?: boolean }) {
  const { user } = useAuth();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const { tasks, updateTaskStatus, deleteTask } = useOperationsStore();

  const displayTasks = personalView ? tasks.filter(t => t.assignee === user?.name) : tasks;

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    const draggedTaskId = displayTasks.filter(t => t.status === sourceStatus)[source.index].id;
    updateTaskStatus(draggedTaskId, destStatus);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-muted p-1 rounded-md w-fit">
          <Button 
            variant={view === 'kanban' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setView('kanban')}
            className="h-8"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" /> Kanban
          </Button>
          <Button 
            variant={view === 'list' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setView('list')}
            className="h-8"
          >
            <List className="h-4 w-4 mr-2" /> List
          </Button>
        </div>
        {!personalView && <AddTaskModal />}
      </div>

      {view === 'kanban' ? (
        <div className="flex-1 overflow-x-auto pb-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 h-full min-h-[500px]">
              {COLUMNS.map(col => (
                <div key={col.id} className="bg-muted/30 rounded-xl border border-border p-3 min-w-[280px] w-[280px] flex flex-col">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="font-semibold text-sm text-muted-foreground">{col.title}</h3>
                    <Badge variant="secondary">{displayTasks.filter(t => t.status === col.id).length}</Badge>
                  </div>
                  
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 transition-colors rounded-lg p-1 ${snapshot.isDraggingOver ? 'bg-muted/50' : ''}`}
                      >
                        {(() => {
                          const tasksInColumn = displayTasks.filter(t => t.status === col.id);
                          return (
                            <>
                              {tasksInColumn.slice(0, 20).map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`bg-card rounded-lg p-4 border shadow-sm mb-3 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors ${snapshot.isDragging ? 'shadow-md border-primary' : 'border-border'}`}
                                      style={{ ...provided.draggableProps.style }}
                                    >
                                      <div className="flex items-start justify-between gap-2 mb-2">
                                        <h4 className="font-semibold text-sm text-foreground leading-tight">{task.title}</h4>
                                      </div>
                                      <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mb-3">
                                        <span className="bg-muted/50 w-fit px-1.5 py-0.5 rounded text-[10px]">{task.ward} • {task.house}</span>
                                        <div className="flex items-center justify-between">
                                          <span>{task.assignee}</span>
                                          <span className={`font-medium ${task.priority === 'High' ? 'text-red-500' : task.priority === 'Medium' ? 'text-amber-500' : 'text-blue-500'}`}>
                                            {task.priority}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" /> {task.deadline}
                                        </span>
                                        <span className="font-medium">{task.progress}%</span>
                                      </div>
                                      {/* Progress bar */}
                                      <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div 
                                          className={`h-full rounded-full ${task.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`} 
                                          style={{ width: `${task.progress}%` }} 
                                        />
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {tasksInColumn.length > 20 && (
                                <div className="text-center p-2 text-xs text-muted-foreground bg-muted/30 rounded-lg">
                                  + {tasksInColumn.length - 20} more tasks...
                                </div>
                              )}
                            </>
                          );
                        })()}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Task Title</th>
                  <th className="px-4 py-3">Ward & House</th>
                  <th className="px-4 py-3">Assignee</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {displayTasks.slice(0, 50).map(task => (
                  <tr key={task.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{task.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{task.ward} • {task.house}</td>
                    <td className="px-4 py-3">{task.assignee}</td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${task.priority === 'High' ? 'text-red-500' : task.priority === 'Medium' ? 'text-amber-500' : 'text-blue-500'}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-1.5 text-muted-foreground"><Clock className="h-3 w-3" /> {task.deadline}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="uppercase text-[10px]">{task.status.replace('_', ' ')}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-secondary h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${task.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${task.progress}%` }} />
                        </div>
                        <span className="text-xs">{task.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {displayTasks.length > 50 && (
            <div className="p-4 border-t border-border flex justify-center bg-muted/20">
              <span className="text-xs text-muted-foreground">Showing 50 of {displayTasks.length} tasks. Use search/filters to find specific tasks.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AddTaskModal() {
  const { addTask } = useOperationsStore();
  const [open, setOpen] = useState(false);
  const [ward, setWard] = useState('');
  const [house, setHouse] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    assignee: 'Unassigned',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    deadline: '',
  });

  const handleSubmit = () => {
    addTask({
      title: formData.title || 'Untitled Task',
      ward: ward || 'N/A',
      house: house || 'N/A',
      assignee: formData.assignee,
      priority: formData.priority,
      deadline: formData.deadline || 'No deadline'
    });
    setOpen(false);
    setWard('');
    setHouse('');
    setFormData({ title: '', assignee: 'Unassigned', priority: 'Medium', deadline: '' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Create Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Task Title</Label>
            <Input id="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Distribute Flyers" />
          </div>
          
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="desc">Description</Label>
            <Input id="desc" placeholder="Task details..." />
          </div>

          <div className="space-y-2">
            <Label>Ward</Label>
            <select 
              value={ward} 
              onChange={e => setWard(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select Ward...</option>
              <option value="Ward 01">Ward 01</option>
              <option value="Ward 02">Ward 02</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>House (Filtered by Ward)</Label>
            <select 
              value={house} 
              onChange={e => setHouse(e.target.value)}
              disabled={!ward}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            >
              <option value="">Select House...</option>
              {ward === 'Ward 01' && <><option value="House 01">House 01</option><option value="House 02">House 02</option></>}
              {ward === 'Ward 02' && <><option value="House 03">House 03</option></>}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Assigned User</Label>
            <Input value={formData.assignee} onChange={e => setFormData({ ...formData, assignee: e.target.value })} placeholder="e.g. Alif Hossain" />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <select 
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input type="date" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
