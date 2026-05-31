import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

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
    useState("Active")

  const [projects,
    setProjects] =
    useState<Project[]>(
      () => {

        const saved =
          localStorage.getItem(
            "pbs_projects"
          )

        if (saved) {

          try {

            const parsed =
              JSON.parse(saved)

            if (
              Array.isArray(
                parsed
              )
            ) {
              return parsed
            }

          } catch {
            console.log(
              "Project parse error"
            )
          }
        }

        return [
          {
            id: 1,
            name:
              "Netflix Ad",
            client:
              "Netflix",
            deadline:
              "2026-06-10",
            status:
              "Active"
          }
        ]
      }
    )

  useEffect(() => {

    localStorage.setItem(
      "pbs_projects",
      JSON.stringify(
        projects
      )
    )

  }, [projects])

  const addProject =
    () => {

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

      const newProject = {

        id:
          Date.now(),

        name:
          projectName,

        client:
          clientName,

        deadline,

        status
      }

      setProjects(
        (
          prev
        ) => [
          ...prev,
          newProject
        ]
      )

      setProjectName("")
      setClientName("")
      setDeadline("")
      setStatus(
        "Active"
      )

      setShowForm(
        false
      )
    }

  const openProject =
    (
      project: Project
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

          <p
            style={{
              color:
                "#888"
            }}
          >
            Manage Projects
          </p>

        </div>

        <button
          onClick={() =>
            setShowForm(
              true
            )
          }
          style={addBtn}
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
              style={card}
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

              <span
                style={
                  statusStyle
                }
              >
                {
                  project.status
                }
              </span>

            </div>
          )
        )}

      </div>

      {showForm && (

        <div
          style={overlay}
        >

          <div
            style={popup}
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
    "pointer",
  transition:
    "0.2s"
}

const statusStyle = {
  background:
    "#FF7A00",
  padding:
    "6px 12px",
  borderRadius:
    "10px"
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
