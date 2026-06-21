import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import type { OfficerTask } from '../types';

import { useOfficersQuery, useTasksQuery, useAssignTaskMutation, useUpdateTaskStatusMutation } from '../hooks/useApiQueries';

export const Officers: React.FC = () => {
  const { data: officers = [], isLoading: isOfficersLoading } = useOfficersQuery();
  const { data: officerTasks = [], isLoading: isTasksLoading } = useTasksQuery();
  const assignTaskMutation = useAssignTaskMutation();
  const updateTaskStatusMutation = useUpdateTaskStatusMutation();

  const { 
    officerAudits
  } = useStore();

  const [activeOfficerId, setActiveOfficerId] = useState<string>('MP-OFF-401');
  const [taskCategory, setTaskCategory] = useState<'AQI' | 'Soil' | 'Forestry' | 'Water'>('Forestry');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const mapCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeOfficer = officers.find(o => o.id === activeOfficerId) || officers[0] || {
    id: '',
    name: 'Loading Officer...',
    avatarUrl: '',
    designation: 'Field Personnel',
    district: 'Madhya Pradesh',
    status: 'ACTIVE',
    perfScore: 0,
    experienceYears: 0,
    lastActivityLocation: 'Retrieving coordinates...'
  };

  // Draw officer coordinates on mini map canvas
  useEffect(() => {
    const canvas = mapCanvasRef.current;
    if (!canvas || !activeOfficer || !activeOfficer.id) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 250;
    canvas.height = 140;

    // Clear background
    ctx.fillStyle = '#1E1E1E';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw topography lines simulation
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let r = 1; r <= 4; r++) {
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, r * 20, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Grid coordinates
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Target radar sweep effect
    const angle = (Date.now() / 600) % (Math.PI * 2);
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.lineTo(
      canvas.width / 2 + Math.cos(angle) * 70,
      canvas.height / 2 + Math.sin(angle) * 70
    );
    ctx.stroke();

    // Pulse target center marker
    const pulseRad = 6 + Math.sin(Date.now() / 200) * 2;
    ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, pulseRad, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#22C55E';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 8px monospace';
    ctx.fillText("GPS LOC LOCKED", 10, canvas.height - 10);
  }, [activeOfficer]);

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskDetails || !activeOfficer.id) return;

    const newTaskId = `TSK-${Date.now()}`;
    const newTask: OfficerTask = {
      id: newTaskId,
      officerId: activeOfficer.id,
      title: taskTitle,
      category: taskCategory,
      status: 'PENDING',
      dateAssigned: new Date().toISOString().split('T')[0],
      details: taskDetails
    };

    assignTaskMutation.mutate(newTask, {
      onSuccess: () => {
        setTaskTitle('');
        setTaskDetails('');
      }
    });
  };

  const handleUpdateStatus = (taskId: string, status: OfficerTask['status']) => {
    updateTaskStatusMutation.mutate({ taskId, status });
  };

  const currentOfficerTasks = officerTasks.filter(t => t.officerId === activeOfficer.id);
  const currentOfficerAudits = officerAudits.filter(a => a.officerId === activeOfficer.id);

  const getStatusBadge = (status: OfficerTask['status']) => {
    if (status === 'APPROVED') return 'bg-green-100 text-green-800 border-green-300';
    if (status === 'REJECTED') return 'bg-error-container/30 text-error border-error/30';
    if (status === 'ESCALATED') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-purple-100 text-purple-800 border-purple-300';
  };

  return (
    <div className="flex-grow flex h-full overflow-hidden bg-surface text-on-surface select-none">
      
      {/* Left: Officer Directory Table (50%) */}
      <section className="w-1/2 h-full flex flex-col border-r border-outline-variant bg-white">
        <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h2 className="font-headline-sm text-label-lg font-bold text-on-background uppercase tracking-wider">
            Officer Directory
          </h2>
          <span className="text-[10px] bg-secondary-container text-on-secondary-container font-mono px-2 py-0.5 rounded font-bold">
            {officers.length} REGISTERED OFFICERS
          </span>
        </div>

        <div className="flex-grow overflow-y-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant text-on-surface-variant font-bold uppercase bg-surface-container-lowest">
                <th className="py-3 px-4">Officer Details</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50 font-medium">
              {isOfficersLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-surface-container-high shrink-0" />
                        <div className="flex-grow space-y-2">
                          <div className="h-3 bg-surface-container-high rounded w-24" />
                          <div className="h-2 bg-surface-container-high rounded w-16" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-3 bg-surface-container-high rounded w-20" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-3 bg-surface-container-high rounded w-12" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="h-3 bg-surface-container-high rounded w-8 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : (
                officers.map(off => {
                  const isActive = activeOfficerId === off.id;
                  return (
                    <tr
                      key={off.id}
                      onClick={() => setActiveOfficerId(off.id)}
                      className={`cursor-pointer transition-colors hover:bg-surface-container-low ${
                        isActive ? 'bg-primary-container/30 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-surface-container border border-outline-variant/60">
                            <img className="w-full h-full object-cover" alt={off.name} src={off.avatarUrl} />
                          </div>
                          <div>
                            <div className="font-bold text-on-surface">{off.name}</div>
                            <div className="text-[10px] text-on-surface-variant font-mono">{off.designation}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant">{off.district}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                          off.status === 'ON-FIELD' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {off.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono-data font-bold text-primary">
                        {off.perfScore}%
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Right: Detailed Workflow Workspace (50%) */}
      <section className="w-1/2 h-full flex flex-col overflow-y-auto p-6 bg-surface-bright space-y-6">
        
        {/* Officer Header Card */}
        <div className="bg-white border border-outline-variant p-5 rounded-lg shadow-xs flex items-center gap-5 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-outline-variant">
              <img className="w-full h-full object-cover" alt={activeOfficer.name} src={activeOfficer.avatarUrl} />
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{activeOfficer.name}</h3>
              <p className="text-body-sm text-on-surface-variant leading-none mt-1">
                {activeOfficer.designation} • {activeOfficer.experienceYears || 12} Years Exp.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">RATING</span>
            <span className="text-headline-md font-bold text-primary font-mono-data">
              {activeOfficer.perfScore}%
            </span>
          </div>
        </div>

        {/* Layout Row: GPS Map & Assignment Form */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Live GPS Map */}
          <div className="bg-white border border-outline-variant p-4 rounded-lg shadow-xs flex flex-col justify-between">
            <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider mb-2">
              Officer Live Coordinates
            </span>
            <div className="bg-surface-container rounded overflow-hidden flex items-center justify-center relative">
              <canvas ref={mapCanvasRef} className="block w-full h-[140px]" />
            </div>
            <p className="text-body-sm font-semibold text-on-surface mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">location_on</span>
              {activeOfficer.lastActivityLocation || 'Lower Satpura Forest Sector B'}
            </p>
          </div>

          {/* Assignment Engine Form */}
          <form 
            onSubmit={handleAssignTask}
            className="bg-white border border-outline-variant p-4 rounded-lg shadow-xs flex flex-col justify-between text-xs space-y-2.5"
          >
            <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">
              Dispatch Task Assignment
            </span>
            
            <div className="flex gap-2 items-center">
              <span className="font-bold text-on-surface-variant">Category:</span>
              <select
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value as any)}
                className="bg-surface-container border border-outline-variant rounded px-2 py-0.5"
              >
                <option value="Forestry">Forestry Cover</option>
                <option value="Water">Hydrology / Water</option>
                <option value="AQI">Air Quality Index</option>
                <option value="Soil">Soil Health</option>
              </select>
            </div>

            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Task Title..."
              className="bg-surface-container border border-outline-variant rounded p-1.5 focus:outline-none w-full"
              required
            />
            
            <textarea
              value={taskDetails}
              onChange={(e) => setTaskDetails(e.target.value)}
              placeholder="Detailed instructions..."
              className="bg-surface-container border border-outline-variant rounded p-1.5 focus:outline-none w-full h-12 resize-none"
              required
            />

            <button
              type="submit"
              disabled={assignTaskMutation.isPending}
              className="w-full py-1.5 bg-primary text-on-primary font-bold rounded uppercase tracking-wider hover:opacity-90 disabled:opacity-50"
            >
              {assignTaskMutation.isPending ? 'Dispatching...' : 'Dispatch Task'}
            </button>
          </form>

        </div>

        {/* Tasks Queue Board */}
        <div className="bg-white border border-outline-variant p-5 rounded-lg shadow-xs space-y-3">
          <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider flex justify-between">
            <span>Active Task Assignments ({currentOfficerTasks.length})</span>
            {isTasksLoading && <span className="animate-pulse text-[9px] text-primary">Refreshing list...</span>}
          </span>

          <div className="space-y-3.5">
            {isTasksLoading && currentOfficerTasks.length === 0 ? (
              <div className="space-y-3.5">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div key={idx} className="p-4 border border-outline-variant/60 bg-surface-container-low rounded-lg animate-pulse space-y-2">
                    <div className="h-4 bg-surface-container-high rounded w-1/3" />
                    <div className="h-3 bg-surface-container-high rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : currentOfficerTasks.length === 0 ? (
              <p className="text-body-sm text-on-surface-variant italic">No pending tasks assigned to this officer.</p>
            ) : (
              currentOfficerTasks.map(task => (
                <div key={task.id} className="p-4 border border-outline-variant/60 bg-surface-container-low rounded-lg relative text-xs">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-primary uppercase">{task.title}</span>
                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 border rounded-sm ${getStatusBadge(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="text-on-surface-variant leading-relaxed mb-3">
                    {task.details}
                  </p>

                  {/* Actions to Approve/Reject/Escalate */}
                  {task.status === 'PENDING' && (
                    <div className="flex gap-2 pt-2 border-t border-outline-variant/35 justify-end">
                      <button
                        onClick={() => handleUpdateStatus(task.id, 'APPROVED')}
                        disabled={updateTaskStatusMutation.isPending}
                        className="px-2.5 py-1 bg-primary text-on-primary hover:opacity-90 font-bold rounded uppercase text-[10px] tracking-wider disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(task.id, 'REJECTED')}
                        disabled={updateTaskStatusMutation.isPending}
                        className="px-2.5 py-1 bg-error text-on-error hover:opacity-90 font-bold rounded uppercase text-[10px] tracking-wider disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(task.id, 'ESCALATED')}
                        disabled={updateTaskStatusMutation.isPending}
                        className="px-2.5 py-1 border border-outline text-on-surface hover:bg-surface-container font-bold rounded uppercase text-[10px] tracking-wider disabled:opacity-50"
                      >
                        Escalate
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Audit Trail Logs */}
        <div className="bg-white border border-outline-variant p-5 rounded-lg shadow-xs space-y-3">
          <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">
            Chronological Audit Trail & Activity Logs
          </span>
          <div className="space-y-2 text-xs">
            {currentOfficerAudits.map(audit => (
              <div key={audit.id} className="flex gap-3 py-1.5 border-b border-outline-variant/30">
                <span className="font-mono text-on-surface-variant font-bold shrink-0">{audit.timestamp}</span>
                <div>
                  <span className="font-bold text-primary mr-1.5">[{audit.action}]</span>
                  <span className="text-on-surface-variant font-medium">{audit.details}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
};

export default Officers;
