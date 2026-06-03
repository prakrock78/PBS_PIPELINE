import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"

import Login
from "./pages/Login"

import Dashboard
from "./pages/Dashboard"

import Artists
from "./pages/Artists"

import Projects
from "./pages/Projects"

import ProjectDetails
from "./pages/ProjectDetails"

import Kanban
from "./pages/Kanban"

import ArtistShots
from "./pages/ArtistShots"

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
          path="/projects"
          element={
            <Projects />
          }
        />

        <Route
          path="/artists"
          element={
            <Artists />
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

        <Route
          path="/artist-shots"
          element={
            <ArtistShots />
          }
        />

      </Routes>

    </BrowserRouter>
  )
}
