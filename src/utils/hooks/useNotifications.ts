import { useEffect, useState } from "react";
import { Subscription } from "rxjs";
import {
  EventChannelImpl,
  WSClientImpl,
  type NotificationMessage,
} from "../../services";

const wsUrl = "ws://localhost:1234";

const channel = new EventChannelImpl();
const wsClient = new WSClientImpl(wsUrl, (msg) => channel.publish(msg));

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  useEffect(() => {
    const sub: Subscription = channel.getStream().subscribe((msg) => {
      setNotifications((prev) => {
        const next = [msg, ...prev];
        return next.slice(0, 50);
      });
    });

    return () => {
      sub.unsubscribe();
      wsClient.close();
    };
  }, []);

  return notifications;
};
