import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import ProjectDetails from "./pages/ProjectDetails"
import Artists from "./pages/Artists"

function App() {

  const isLoggedIn =
    localStorage.getItem(
      "pbs_login"
    )

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            isLoggedIn
              ? (
                <Navigate
                  to="/dashboard"
                />
              )
              : (
                <Login />
              )
          }
        />

        <Route
          path="/dashboard"
          element={
            isLoggedIn
              ? (
                <Dashboard />
              )
              : (
                <Navigate
                  to="/"
                />
              )
          }
        />

        <Route
          path="/projects"
          element={
            isLoggedIn
              ? (
                <Projects />
              )
              : (
                <Navigate
                  to="/"
                />
              )
          }
        />

        <Route
          path="/project-details"
          element={
            isLoggedIn
              ? (
                <ProjectDetails />
              )
              : (
                <Navigate
                  to="/"
                />
              )
          }
        />

        <Route
          path="/artists"
          element={
            isLoggedIn
              ? (
                <Artists />
              )
              : (
                <Navigate
                  to="/"
                />
              )
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App
