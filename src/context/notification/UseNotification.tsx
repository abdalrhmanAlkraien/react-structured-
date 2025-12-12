import {useNotificationContext} from "../../providers/NotificationProvider.tsx";


export function useNotification() {
    const { notify } = useNotificationContext();

    return {
        success: (msg: string) => notify("success", msg),
        error: (msg: string) => notify("error", msg),
        info: (msg: string) => notify("info", msg),
        warning: (msg: string) => notify("warning", msg),
    };
}
