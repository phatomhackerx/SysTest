import React from 'react';
import { useWatson } from '../../context/WatsonContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotifications: React.FC = () => {
  const { notifications, dismissNotification } = useWatson();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-10 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {notifications.map((n) => {
        let borderClass = 'border-[#2d3748] bg-[#141820]/95';
        let icon = <Info className="w-4 h-4 text-cyan-400 shrink-0" />;

        if (n.type === 'success') {
          borderClass = 'border-emerald-500/40 bg-[#101915]/95';
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
        } else if (n.type === 'warning') {
          borderClass = 'border-amber-500/40 bg-[#1c1810]/95';
          icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
        } else if (n.type === 'error') {
          borderClass = 'border-rose-500/40 bg-[#1c1214]/95';
          icon = <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
        }

        return (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-start gap-3 p-3 rounded border text-xs shadow-xl backdrop-blur-sm transition-all duration-200 ${borderClass}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-[#e2e8f0] tracking-wide">{n.title}</span>
                <span className="text-[10px] text-[#718096] font-mono">{n.timestamp}</span>
              </div>
              <p className="text-[#a0aec0] mt-0.5 leading-relaxed break-words">{n.message}</p>
            </div>
            <button
              onClick={() => dismissNotification(n.id)}
              className="text-[#718096] hover:text-[#e2e8f0] p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
