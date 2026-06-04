import {
  useState,
  useEffect
} from "react"

import {
  useNavigate
} from "react-router-dom"

type Project = {
  id: number
  name: string
  client: string
  deadline: string
  status: string
}

export default function Projects() {

  const navigate =
    useNavigate()

  const [showForm,
    setShowForm] =
    useState(false)

  const [projects,
    setProjects] =
    useState<Project[]>(
      []
    )

  const [projectName,
    setProjectName] =
    useState("")

  const [clientName,
    setClientName] =
    useState("")

  const [deadline,
    setDeadline] =
    useState("")

  const [status,
    setStatus] =
    useState(
      "Active"
    )

  const loadProjects =
    async () => {

      try {

        const res =
          await fetch(
            "http://127.0.0.1:8000/projects"
          )

        const data =
          await res.json()

        setProjects(
          data
        )

      } catch {

        alert(
          "Failed to load projects"
        )
      }
    }

  useEffect(() => {

    loadProjects()

  }, [])

  const addProject =
    async () => {

      if (
        !projectName ||
        !clientName ||
        !deadline
      ) {

        alert(
          "Fill all fields"
        )

        return
      }

      try {

        const res =
          await fetch(
            "http://127.0.0.1:8000/projects",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                "application/json"
              },

              body:
                JSON.stringify({
                  name:
                    projectName,

                  client:
                    clientName,

                  deadline,

                  status
                })
            }
          )

        if (
          !res.ok
        ) {

          alert(
            "Project create failed"
          )

          return
        }

        setProjectName("")
        setClientName("")
        setDeadline("")
        setStatus(
          "Active"
        )

        setShowForm(
          false
        )

        loadProjects()

      } catch {

        alert(
          "Server Error"
        )
      }
    }

  const openProject =
    (
      project:
      Project
    ) => {

      localStorage.setItem(
        "selected_project",
        JSON.stringify(
          project
        )
      )

      navigate(
        "/project-details"
      )
    }

  return (

    <div
      style={{
        background:
        "#0B0B0B",
        minHeight:
        "100vh",
        color:
        "white",
        padding:
        "30px"
      }}
    >

      <div
        style={{
          display:
          "flex",
          justifyContent:
          "space-between",
          alignItems:
          "center"
        }}
      >

        <div>

          <h1>
            Projects
          </h1>

        </div>

        <button
          onClick={() =>
            setShowForm(
              true
            )
          }
          style={
            addBtn
          }
        >
          + Add Project
        </button>

      </div>

      <div
        style={{
          display:
          "grid",
          gridTemplateColumns:
          "repeat(3,1fr)",
          gap:
          "20px",
          marginTop:
          "30px"
        }}
      >

        {projects.map(
          (
            project
          ) => (

            <div
              key={
                project.id
              }
              style={
                card
              }
              onClick={() =>
                openProject(
                  project
                )
              }
            >

              <h2>
                {
                  project.name
                }
              </h2>

              <p>
                Client:
                {" "}
                {
                  project.client
                }
              </p>

              <p>
                Deadline:
                {" "}
                {
                  project.deadline
                }
              </p>

            </div>
          )
        )}

      </div>

      {showForm && (

        <div
          style={
            overlay
          }
        >

          <div
            style={
              popup
            }
          >

            <h2>
              Add Project
            </h2>

            <input
              placeholder=
              "Project Name"
              value={
                projectName
              }
              onChange={
                (e) =>
                setProjectName(
                  e.target
                    .value
                )
              }
              style={
                inputStyle
              }
            />

            <input
              placeholder=
              "Client Name"
              value={
                clientName
              }
              onChange={
                (e) =>
                setClientName(
                  e.target
                    .value
                )
              }
              style={
                inputStyle
              }
            />

            <input
              type="date"
              value={
                deadline
              }
              onChange={
                (e) =>
                setDeadline(
                  e.target
                    .value
                )
              }
              style={
                inputStyle
              }
            />

            <button
              onClick={
                addProject
              }
              style={
                addBtn
              }
            >
              Save Project
            </button>

          </div>

        </div>
      )}

    </div>
  )
}

const card = {
  background:
  "#171717",
  padding:
  "20px",
  borderRadius:
  "20px",
  cursor:
  "pointer"
}

const addBtn = {
  background:
  "#FF7A00",
  border:
  "none",
  color:
  "white",
  padding:
  "12px 20px",
  borderRadius:
  "10px",
  cursor:
  "pointer"
}

const overlay = {
  position:
  "fixed" as const,
  top: 0,
  left: 0,
  width:
  "100%",
  height:
  "100%",
  background:
  "rgba(0,0,0,0.8)",
  display:
  "flex",
  justifyContent:
  "center",
  alignItems:
  "center"
}

const popup = {
  width:
  "400px",
  background:
  "#171717",
  padding:
  "30px",
  borderRadius:
  "20px"
}

const inputStyle = {
  width:
  "100%",
  padding:
  "12px",
  marginTop:
  "15px",
  background:
  "#252525",
  border:
  "1px solid #333",
  color:
  "white",
  borderRadius:
  "10px",
  boxSizing:
  "border-box" as const
}
