import "./App.css";
import { NotificationList } from "./components";
import { useNotifications } from "./utils";

function App() {
  const notifications = useNotifications();

  return <NotificationList notifications={notifications} />;
}

export default App;
