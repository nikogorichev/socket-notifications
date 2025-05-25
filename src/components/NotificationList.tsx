import type { NotificationMessage } from "../services";

type Props = {
  notifications: NotificationMessage[];
};

export const NotificationList = (props: Props) => {
  const { notifications } = props;
  return (
    <>
      <h1>Сокет уведомления</h1>
      <ul>
        {notifications.map((n) => (
          <li key={n.id}>
            <div>{n.message}</div>
            <div>{n.timestamp}</div>
          </li>
        ))}
      </ul>
    </>
  );
};
