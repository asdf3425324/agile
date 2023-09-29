import {
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom"
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Board from './pages/BoardVeiw'

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation()

  if (!localStorage.getItem('token')) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return children
}
const Layout = () => { return <Outlet /> }

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route element={<Layout />}>
        <Route path= '/dashboard' element={<RequireAuth><Dashboard /></RequireAuth>}/>
        <Route path= '/b/:id' element={<Board/>}/>
      </Route>
    </Routes>
  )
}

export default App
