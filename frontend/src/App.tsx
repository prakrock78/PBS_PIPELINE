import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Artists from "./pages/Artists"
import Projects from "./pages/Projects"
import ProjectDetails from "./pages/ProjectDetails"
import Kanban from "./pages/Kanban"

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Login />
          }
        />

        <Route
          path="/dashboard"
          element={
            <Dashboard />
          }
        />

        <Route
          path="/artists"
          element={
            <Artists />
          }
        />

        <Route
          path="/projects"
          element={
            <Projects />
          }
        />

        <Route
          path="/project-details"
          element={
            <ProjectDetails />
          }
        />

        <Route
          path="/kanban"
          element={
            <Kanban />
          }
        />

      </Routes>

    </BrowserRouter>
  )
}
