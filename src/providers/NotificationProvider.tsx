import React, {createContext, useContext, useEffect, useRef, useState,} from "react";
import {Spinner} from "../common/component/spinner/Spinner.tsx";

type NotificationType = "success" | "error" | "info" | "warning";

interface Notification {
    type: NotificationType;
    message: string;
}

interface NotificationContextType {
    notify: (type: NotificationType, message: string) => Promise<void>;
}

const NotificationContext =
    createContext<NotificationContextType | null>(null);

const AUTO_CLOSE_MS = 2000;

export function NotificationProvider({
                                         children,
                                     }: {
    children: React.ReactNode;
}) {
    const [notification, setNotification] =
        useState<Notification | null>(null);

    const [progress, setProgress] = useState(100);

    const timerRef = useRef<number | null>(null);
    const intervalRef = useRef<number | null>(null);
    const isNotifyingRef = useRef(false);


    function clearTimers() {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
    }

    function notify(type: NotificationType, message: string): Promise<void> {
        if (isNotifyingRef.current) {
            return Promise.resolve(); // ⛔ ignore duplicate call
        }

        isNotifyingRef.current = true;

        return new Promise((resolve) => {
            clearTimers();

            setNotification({ type, message });
            setProgress(100);

            const start = Date.now();

            intervalRef.current = window.setInterval(() => {
                const elapsed = Date.now() - start;
                const percent = Math.max(
                    0,
                    100 - (elapsed / AUTO_CLOSE_MS) * 100
                );
                setProgress(percent);
            }, 50);

            timerRef.current = window.setTimeout(() => {
                clearTimers();
                setNotification(null);
                isNotifyingRef.current = false; // ✅ allow next notification
                resolve();
            }, AUTO_CLOSE_MS);
        });
    }



    // Cleanup on unmount
    useEffect(() => {
        return () => clearTimers();
    }, []);

    return (
        <NotificationContext.Provider value={{notify}}>
            {children}

            {notification && (
                <div className="notification-overlay">
                    <div className="notification-center">
                        <Spinner size={20}/>
                        <span className="notification-message">
                {notification.message}
            </span>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotificationContext() {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error(
            "useNotification must be used inside NotificationProvider"
        );
    }
    return ctx;
}
