import { Route, Routes } from 'react-router-dom'
import { BareLayout, ConsoleLayout, StudentLayout } from './components/layout'
import { ToastProvider } from './components/ui'
import Landing from './pages/Landing'
import Register from './pages/Register'
import Welcome from './pages/Welcome'
import Dashboard from './pages/Dashboard'
import Leaderboard from './pages/Leaderboard'
import Overview from './pages/console/Overview'
import Experiment from './pages/console/Experiment'
import Model from './pages/console/Model'
import System from './pages/System'
import Deck from './pages/Deck'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<StudentLayout />}>
          <Route index element={<Landing />} />
          <Route path="register" element={<Register />} />
          <Route path="welcome" element={<Welcome />} />
          <Route path="me" element={<Dashboard />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="console" element={<ConsoleLayout />}>
          <Route index element={<Overview />} />
          <Route path="experiment" element={<Experiment />} />
          <Route path="model" element={<Model />} />
        </Route>
        <Route element={<BareLayout />}>
          <Route path="system" element={<System />} />
        </Route>
        <Route path="deck" element={<Deck />} />
      </Routes>
    </ToastProvider>
  )
}
