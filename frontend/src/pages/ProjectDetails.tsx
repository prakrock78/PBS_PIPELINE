import { useEffect, useState } from "react"

type Review = {
  id: number
  status: string
  notes: string
  reviewedAt: string
}

type Version = {
  id: number
  version: string
  fileName: string
  notes: string
  uploadedAt: string
}

type Shot = {
  name: string
  artist: string
  status: string
  priority: string
  dueDate: string
  versions: Version[]
  clientReview?: string
  clientNotes?: string
  reviewHistory?: Review[]
}

type Project = {
  id: number
  name: string
  client: string
  deadline: string
  status: string
}

type Artist = {
  id: number
  name: string
  department: string
  role: string
  availability: string
}

export default function ProjectDetails() {

  const [project, setProject] =
    useState<Project | null>(null)

  const [artists, setArtists] =
    useState<Artist[]>([])

  const [shots, setShots] =
    useState<Shot[]>([])

  const [showForm, setShowForm] =
    useState(false)

  const [shotName, setShotName] =
    useState("")

  const [artist, setArtist] =
    useState("")

  const [status, setStatus] =
    useState("Assigned")

  const [priority, setPriority] =
    useState("Medium")

  const [dueDate, setDueDate] =
    useState("")

  const [fileName, setFileName] =
    useState("")

  const [notes, setNotes] =
    useState("")

  const workflow = [
    "Not Started",
    "Assigned",
    "WIP",
    "Review",
    "Retake",
    "Approved",
    "Delivered"
  ]

  useEffect(() => {

    const selected =
      localStorage.getItem(
        "selected_project"
      )

    const savedArtists =
      localStorage.getItem(
        "pbs_artists"
      )

    if (savedArtists) {

      setArtists(
        JSON.parse(
          savedArtists
        )
      )
    }

    if (selected) {

      const parsed =
        JSON.parse(selected)

      setProject(parsed)

      const savedShots =
        localStorage.getItem(
          `pbs_shots_${parsed.id}`
        )

      if (savedShots) {

        const parsedShots =
          JSON.parse(savedShots)

        const safeShots =
          parsedShots.map(
            (shot: any) => ({
              ...shot,
              versions:
                shot.versions || [],
              clientReview:
                shot.clientReview ||
                "Pending",
              clientNotes:
                shot.clientNotes || "",
              reviewHistory:
                shot.reviewHistory || []
            })
          )

        setShots(safeShots)
      }
    }

  }, [])

  useEffect(() => {

    if (project) {

      localStorage.setItem(
        `pbs_shots_${project.id}`,
        JSON.stringify(shots)
      )
    }

  }, [shots, project])

  const getStatusColor =
    (value: string) => {

      switch (value) {

        case "Delivered":
          return "#16A34A"

        case "Approved":
          return "#059669"

        case "Review":
          return "#2563EB"

        case "WIP":
          return "#F59E0B"

        case "Retake":
          return "#DC2626"

        case "Assigned":
          return "#7C3AED"

        default:
          return "#6B7280"
      }
    }

  const getReviewColor =
    (value: string) => {

      switch (value) {

        case "Approved":
          return "#16A34A"

        case "Retake":
          return "#DC2626"

        case "Hold":
          return "#F59E0B"

        default:
          return "#6B7280"
      }
    }

  const resetForm = () => {

    setShotName("")
    setArtist("")
    setStatus("Assigned")
    setPriority("Medium")
    setDueDate("")
    setFileName("")
    setNotes("")
    setShowForm(false)
  }

  const saveShot = () => {

    if (
      !shotName ||
      !artist ||
      !dueDate
    ) {

      alert(
        "Fill all fields"
      )

      return
    }

    const firstVersion =
      fileName
        ? [
            {
              id:
                Date.now(),
              version:
                "v001",
              fileName,
              notes,
              uploadedAt:
                new Date()
                  .toLocaleString()
            }
          ]
        : []

    const shotData = {

      name:
        shotName,

      artist,

      status,

      priority,

      dueDate,

      versions:
        firstVersion,

      clientReview:
        "Pending",

      clientNotes:
        "",

      reviewHistory:
        []
    }

    setShots([
      ...shots,
      shotData
    ])

    resetForm()
  }

  const addVersion =
    (index: number) => {

      const file =
        prompt(
          "Enter File Name"
        )

      if (!file)
        return

      const note =
        prompt(
          "Version Notes"
        ) || ""

      const updated =
        [...shots]

      const versionCount =
        updated[index]
          .versions.length + 1

      updated[index]
        .versions.push({

        id:
          Date.now(),

        version:
          `v${String(
            versionCount
          ).padStart(
            3,
            "0"
          )}`,

        fileName:
          file,

        notes:
          note,

        uploadedAt:
          new Date()
            .toLocaleString()
      })

      setShots(updated)
    }

  const addClientReview =
    (index: number) => {

      const review =
        prompt(
          "Approved / Retake / Hold"
        )

      if (!review)
        return

      const note =
        prompt(
          "Client Notes"
        ) || ""

      const updated =
        [...shots]

      updated[index] = {

        ...updated[index],

        clientReview:
          review,

        clientNotes:
          note,

        reviewHistory: [

          ...(updated[index]
            .reviewHistory || []),

          {
            id:
              Date.now(),

            status:
              review,

            notes:
              note,

            reviewedAt:
              new Date()
                .toLocaleString()
          }
        ]
      }

      setShots(updated)
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
            {project?.name}
          </h1>

          <p
            style={{
              color:
                "#888"
            }}
          >
            Client:{" "}
            {project?.client}
          </p>

        </div>

        <button
          onClick={() =>
            setShowForm(true)
          }
          style={addBtn}
        >
          + Add Shot
        </button>

      </div>

      <div
        style={{
          marginTop:
            "30px"
        }}
      >

        {shots.map(
          (
            shot,
            index
          ) => (

            <div
              key={index}
              style={shotCard}
            >

              <h2>
                {shot.name}
              </h2>

              <p>
                Artist:{" "}
                {shot.artist}
              </p>

              <p>
                Due:{" "}
                {shot.dueDate}
              </p>

              <span
                style={{
                  background:
                    getStatusColor(
                      shot.status
                    ),
                  padding:
                    "6px 12px",
                  borderRadius:
                    "10px"
                }}
              >
                {shot.status}
              </span>

              <div
                style={{
                  marginTop:
                    "20px"
                }}
              >

                <strong>
                  Client Review:
                </strong>

                <span
                  style={{
                    background:
                      getReviewColor(
                        shot.clientReview ||
                        "Pending"
                      ),
                    padding:
                      "6px 12px",
                    borderRadius:
                      "10px",
                    marginLeft:
                      "10px"
                  }}
                >
                  {
                    shot.clientReview ||
                    "Pending"
                  }
                </span>

                {shot.clientNotes && (

                  <p
                    style={{
                      marginTop:
                        "10px"
                    }}
                  >
                    Notes:{" "}
                    {
                      shot.clientNotes
                    }
                  </p>
                )}

              </div>

              <h3
                style={{
                  marginTop:
                    "20px"
                }}
              >
                Version History
              </h3>

              {shot.versions.map(
                (
                  version
                ) => (

                  <div
                    key={
                      version.id
                    }
                    style={
                      versionCard
                    }
                  >

                    <strong>
                      {
                        version.version
                      }
                    </strong>

                    <p>
                      File:{" "}
                      {
                        version.fileName
                      }
                    </p>

                    <p>
                      Notes:{" "}
                      {
                        version.notes
                      }
                    </p>

                    <small>
                      {
                        version.uploadedAt
                      }
                    </small>

                  </div>
                )
              )}

              <h3
                style={{
                  marginTop:
                    "20px"
                }}
              >
                Review History
              </h3>

              {(shot.reviewHistory || [])
                .map(
                  (
                    review
                  ) => (

                    <div
                      key={
                        review.id
                      }
                      style={
                        versionCard
                      }
                    >

                      <strong>
                        {
                          review.status
                        }
                      </strong>

                      <p>
                        {
                          review.notes
                        }
                      </p>

                      <small>
                        {
                          review.reviewedAt
                        }
                      </small>

                    </div>
                  )
                )}

              <div
                style={{
                  display:
                    "flex",
                  gap:
                    "10px",
                  marginTop:
                    "20px"
                }}
              >

                <button
                  onClick={() =>
                    addVersion(
                      index
                    )
                  }
                  style={addBtn}
                >
                  + Upload New Version
                </button>

                <button
                  onClick={() =>
                    addClientReview(
                      index
                    )
                  }
                  style={{
                    ...addBtn,
                    background:
                      "#2563EB"
                  }}
                >
                  Client Review
                </button>

              </div>

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
              Add Shot
            </h2>

            <input
              placeholder=
              "Shot Name"
              value={
                shotName
              }
              onChange={(e) =>
                setShotName(
                  e.target.value
                )
              }
              style={
                inputStyle
              }
            />

            <select
              value={artist}
              onChange={(e) =>
                setArtist(
                  e.target.value
                )
              }
              style={
                inputStyle
              }
            >

              <option value="">
                Select Artist
              </option>

              {artists.map(
                (
                  artist
                ) => (

                  <option
                    key={
                      artist.id
                    }
                    value={
                      artist.name
                    }
                  >
                    {
                      artist.name
                    }
                    {" - "}
                    {
                      artist.department
                    }
                  </option>
                )
              )}

            </select>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
              style={
                inputStyle
              }
            >
              {workflow.map(
                (
                  item
                ) => (
                  <option
                    key={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(
                  e.target.value
                )
              }
              style={
                inputStyle
              }
            />

            <input
              type="file"
              onChange={(e) => {

                const file =
                  e.target
                    .files?.[0]

                if (file) {

                  setFileName(
                    file.name
                  )
                }
              }}
              style={
                inputStyle
              }
            />

            <textarea
              placeholder=
              "Version Notes"
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              style={{
                ...inputStyle,
                minHeight:
                  "90px"
              }}
            />

            <button
              onClick={saveShot}
              style={saveBtn}
            >
              Save Shot
            </button>

          </div>

        </div>
      )}

    </div>
  )
}

const shotCard = {
  background: "#171717",
  padding: "20px",
  borderRadius: "20px",
  marginBottom: "20px"
}

const versionCard = {
  background: "#252525",
  padding: "12px",
  borderRadius: "12px",
  marginTop: "10px"
}

const addBtn = {
  background: "#FF7A00",
  border: "none",
  color: "white",
  padding: "12px 20px",
  borderRadius: "10px",
  cursor: "pointer"
}

const overlay = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
}

const popup = {
  width: "450px",
  background: "#171717",
  padding: "30px",
  borderRadius: "20px"
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  background: "#252525",
  border: "1px solid #333",
  color: "white",
  borderRadius: "10px",
  boxSizing: "border-box" as const
}

const saveBtn = {
  width: "100%",
  padding: "12px",
  marginTop: "20px",
  background: "#FF7A00",
  border: "none",
  color: "white",
  borderRadius: "10px",
  cursor: "pointer"
}

