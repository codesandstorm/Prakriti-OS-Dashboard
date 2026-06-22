import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    archiveNotification,
    setCurrentPage,
    addToast
  } = useStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'critical'>('all');

  if (!isOpen) return null;

  const activeNotifs = notifications.filter(n => !n.archived);

  const filteredNotifs = activeNotifs.filter(n => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'critical') return n.type === 'critical';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical': return 'dangerous';
      case 'warning': return 'warning';
      case 'success': return 'check_circle';
      case 'assignment': return 'assignment';
      case 'approval': return 'border_color';
      default: return 'info';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-error';
      case 'warning': return 'text-[#F59E0B]';
      case 'success': return 'text-green-500';
      case 'assignment': return 'text-secondary';
      case 'approval': return 'text-tertiary';
      default: return 'text-on-surface-variant';
    }
  };

  return (
    <>
      <div 
        className="absolute right-0 mt-2 w-96 bg-white border border-outline-variant shadow-2xl rounded-lg flex flex-col z-50 text-on-surface"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-outline-variant flex justify-between items-center bg-surface-container-low rounded-t-lg">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">notifications</span>
            <span className="text-body-md font-bold text-primary">Notification Center</span>
          </div>
          <button 
            onClick={markAllNotificationsRead}
            className="text-[11px] font-bold text-primary hover:underline"
          >
            Mark all read
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex border-b border-outline-variant text-[11px] font-bold bg-surface-container-lowest">
          {(['all', 'unread', 'critical'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 py-2 text-center border-b-2 uppercase tracking-wider transition-colors ${
                activeFilter === filter 
                  ? 'border-primary text-primary font-extrabold bg-surface-container-low' 
                  : 'border-transparent text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {filter} ({
                filter === 'all' ? activeNotifs.length :
                filter === 'unread' ? activeNotifs.filter(n => !n.read).length :
                activeNotifs.filter(n => n.type === 'critical').length
              })
            </button>
          ))}
        </div>

        {/* Notifications list */}
        <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/50 bg-white">
          {filteredNotifs.length > 0 ? (
            filteredNotifs.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  setCurrentPage('dashboard');
                  addToast(`Navigating to event: ${notif.title}`, 'info');
                  onClose();
                }}
                className={`p-3 flex gap-3 cursor-pointer transition-colors hover:bg-surface-container-low ${
                  !notif.read ? 'bg-primary-container/5 font-semibold' : ''
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] shrink-0 ${getIconColor(notif.type)}`}>
                  {getIcon(notif.type)}
                </span>
                <div className="flex-1 flex flex-col gap-0.5 text-xs">
                  <div className="flex justify-between items-start">
                    <span className={`font-bold ${notif.type === 'critical' ? 'text-error' : 'text-on-surface'}`}>
                      {notif.title}
                    </span>
                    <span className="text-[9px] text-on-surface-variant font-mono-data">
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-body-sm leading-normal">
                    {notif.description}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded uppercase ${
                      notif.priority === 'high' ? 'bg-error-container text-error' :
                      notif.priority === 'medium' ? 'bg-secondary-container text-on-secondary-container' :
                      'bg-surface-container text-on-surface-variant'
                    }`}>
                      {notif.priority} Priority
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); archiveNotification(notif.id); }}
                      className="text-[10px] text-on-surface-variant hover:text-primary"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-body-sm text-on-surface-variant italic">
              No notifications matching filters.
            </div>
          )}
        </div>
      </div>
      {/* Click outside backdrop close helper */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
    </>
  );
};
export default NotificationCenter;
