import { GlassCard } from "@/components/ui/GlassCard";
import { Bell, Check, Clock, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { Notification } from "@/services/notificationService";
import { formatDistanceToNow } from "date-fns";

interface NotificationDropdownProps {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onClose: () => void;
}

export function NotificationDropdown({ notifications, onMarkAsRead, onClose }: NotificationDropdownProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case "success": return <CheckCircle className="h-4 w-4 text-emerald-500" />;
            case "warning": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
            case "error": return <XCircle className="h-4 w-4 text-rose-500" />;
            default: return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <div className="absolute top-16 right-4 w-80 z-50">
            <div className="fixed inset-0 z-40" onClick={onClose} /> {/* Backdrop */}
            <GlassCard className="relative z-50 max-h-[400px] flex flex-col overflow-hidden border-white/10 shadow-2xl backdrop-blur-3xl bg-[#0B0F19]/90">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    <span className="text-xs text-slate-400">{notifications.filter(n => !n.read).length} unread</span>
                </div>

                <div className="overflow-y-auto flex-1 custom-scrollbar">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!notification.read ? 'bg-white/[0.02]' : ''}`}
                                onClick={() => onMarkAsRead(notification.id)}
                            >
                                <div className="flex gap-3">
                                    <div className="mt-1 shrink-0">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium ${!notification.read ? 'text-white' : 'text-slate-400'}`}>
                                            {notification.title}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                            {notification.message}
                                        </p>
                                        <p className="text-[10px] text-slate-600 mt-2 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-2" />
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-slate-500">
                            <Bell className="h-8 w-8 mx-auto mb-3 opacity-20" />
                            <p className="text-sm">No notifications</p>
                        </div>
                    )}
                </div>

                <div className="p-3 border-t border-white/5 bg-white/[0.02]">
                    <button onClick={onClose} className="w-full text-xs text-center text-slate-400 hover:text-white transition-colors">
                        Close
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}
