import './App.css'
import NotificationList from './components/NotificationList'
import { useNotifications } from './utils/hooks/useNotifications'

function App() {
  const notifications = useNotifications()

  return <NotificationList notifications={notifications} />
}

export default App
