import {
  useEffect,
  useState
} from "react"

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
  fileUrl?: string
  fileType?: string
  notes: string
  uploadedAt: string
}

type Shot = {
  id?: number
  project_id?: number
  name: string
  artist: string
  status: string
  priority: string
  level?: string
  dueDate: string
  due_date?: string

  lead_note?: string
  supervisor_note?: string

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

  const [project,
    setProject] =
    useState<Project | null>(
      null
    )

  const [artists,
    setArtists] =
    useState<Artist[]>(
      []
    )

  const [shots,
    setShots] =
    useState<Shot[]>(
      []
    )

  const [showForm,
    setShowForm] =
    useState(false)

  const [previewOpen,
    setPreviewOpen] =
    useState(false)

  const [previewFile,
    setPreviewFile] =
    useState<Version | null>(
      null
    )

  const [shotName,
    setShotName] =
    useState("")

  const [artist,
    setArtist] =
    useState("")

  const [status,
    setStatus] =
    useState("Assigned")

  const [priority,
    setPriority] =
    useState("Medium")

  const [shotLevel,
    setShotLevel] =
    useState("Junior")

  const [dueDate,
    setDueDate] =
    useState("")

  const [notes,
    setNotes] =
    useState("")

  const [inputPath,
  setInputPath] =
  useState("")

const [workPath,
  setWorkPath] =
  useState("")

const [publishPath,
  setPublishPath] =
  useState("")

const [outputPath,
  setOutputPath] =
  useState("")

  const workflow = [
    "Assigned",
    "WIP",
    "DONE",
    "LEAD_APPROVED",
    "APPROVED",
    "SUP_KICKBACK"
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

    if (
      savedArtists
    ) {

      setArtists(
        JSON.parse(
          savedArtists
        )
      )
    }

    if (
      selected
    ) {

      const parsed =
        JSON.parse(
          selected
        )

      setProject(
        parsed
      )

      loadShots(
        parsed.id
      )
    }

  }, [])

  const loadShots =
    async (
      projectId:
        number
    ) => {

      try {

        const response =
          await fetch(
            "http://127.0.0.1:8000/shots"
          )

        const data =
          await response.json()

        const filtered =
          data
            .filter(
              (
                shot: any
              ) =>
                shot.project_id ===
                projectId
            )
            .map(
              (
                shot: any
              ) => ({

                ...shot,

                dueDate:
                  shot.due_date,

                versions:
                  [],

                clientReview:
                  "Pending",

                clientNotes:
                  "",

                reviewHistory:
                  []
              })
            )

        setShots(
          filtered
        )

      } catch {

        alert(
          "Failed to load shots"
        )
      }
    }

  const saveShot =
    async () => {

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

      if (
        !project
      ) {

        return
      }

      try {

        const response =
          await fetch(
            "http://127.0.0.1:8000/shots",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify({
                  project_id:
                    project.id,

                  name:
                    shotName,

                  artist,

                  status,

                  priority,

                  level:
                    shotLevel,

                  due_date:
                    dueDate,

                  input_path:
                    inputPath,

                  work_path:
                    workPath,

                  publish_path:
                    publishPath,

                  output_path:
                    outputPath
                })
            }
          )

        if (
          !response.ok
        ) {

          alert(
            "Shot save failed"
          )

          return
        }

        loadShots(
          project.id
        )

        resetForm()

        alert(
          "Shot Created"
        )

      } catch {

        alert(
          "Server Error"
        )
      }
    }

  const resetForm =
    () => {

      setShotName("")
      setArtist("")
      setStatus(
        "Assigned"
      )
      setPriority(
        "Medium"
      )
      setShotLevel(
        "Junior"
      )
      setDueDate("")
      setNotes("")
      setShowForm(
        false
      )
    }

      const addVersion =
    (
      index:
        number
    ) => {

      const file =
        prompt(
          "Enter File Name"
        )

      if (
        !file
      )
        return

      const note =
        prompt(
          "Version Notes"
        ) || ""

      const updated =
        [...shots]

      const versionCount =
        updated[index]
          .versions
          .length + 1

      updated[
        index
      ]
        .versions
        .push({

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

      setShots(
        updated
      )
    }

  const addClientReview =
    (
      index:
        number
    ) => {

      const review =
        prompt(
          "Approved / Retake / Hold"
        )

      if (
        !review
      )
        return

      const note =
        prompt(
          "Client Notes"
        ) || ""

      const updated =
        [...shots]

      updated[
        index
      ] = {

        ...updated[
          index
        ],

        clientReview:
          review,

        clientNotes:
          note
      }

      setShots(
        updated
      )
    }

    const copyPath =
  async (
    path:
      string
  ) => {

    if (
      !path
    ) {

      alert(
        "No path found"
      )

      return
    }

    await navigator
      .clipboard
      .writeText(
        path
      )

    alert(
      "Path copied"
    )
  }

const openFolder =
  async (
    path:
      string
  ) => {

    if (
      !path
    ) {

      alert(
        "No path found"
      )

      return
    }

    try {

      await fetch(
        `http://127.0.0.1:8000/shots/open-folder?path=${encodeURIComponent(
          path
        )}`
      )

    } catch {

      alert(
        "Folder open failed"
      )
    }
  }

  const openPreview =
    (
      version:
        Version
    ) => {

      setPreviewFile(
        version
      )

      setPreviewOpen(
        true
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
            {
              project?.name
            }
          </h1>

          <p
            style={{
              color:
                "#888"
            }}
          >
            Client:
            {" "}
            {
              project?.client
            }
          </p>

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
              key={
                shot.id
              }
              style={
                shotCard
              }
            >

              <h2>
                {
                  shot.name
                }
              </h2>

              <p>
                Artist:
                {" "}
                {
                  shot.artist
                }
              </p>

              <p>
                Level:
                {" "}
                {
                  shot.level ||
                  "Junior"
                }
              </p>

              {(
                shot.level ===
                "Senior" ||

                shot.level ===
                "Hero"
              ) && (

                <p
                  style={{
                    color:
                      "#F59E0B",
                    fontWeight:
                      "bold"
                  }}
                >
                  ⚠ High
                  seniority
                  shot
                </p>
              )}

              <p>
  Work Path:
  {" "}
  {
    (shot as any)
      .work_path ||
    "Not Set"
  }
</p>

<p>
  Publish:
  {" "}
  {
    (shot as any)
      .publish_path ||
    "Not Set"
  }
</p>

<div
  style={{
    display:
      "flex",
    gap:
      "10px",
    marginTop:
      "12px",
    flexWrap:
      "wrap"
  }}
>

  <button
    onClick={() =>
      copyPath(
        (shot as any)
          .work_path
      )
    }
    style={{
      background:
        "#2563EB",
      border:
        "none",
      color:
        "white",
      padding:
        "8px 14px",
      borderRadius:
        "8px",
      cursor:
        "pointer"
    }}
  >
    📋 Copy Work Path
  </button>

  <button
    onClick={() =>
      openFolder(
        (shot as any)
          .work_path
      )
    }
    style={{
      background:
        "#16A34A",
      border:
        "none",
      color:
        "white",
      padding:
        "8px 14px",
      borderRadius:
        "8px",
      cursor:
        "pointer"
    }}
  >
    📂 Open Folder
  </button>

</div>  

              <p>
                Due:
                {" "}
                {
                  shot.dueDate
                }
              </p>

              <p>
                Status:
                {" "}
                {
                  shot.status
                }
              </p>

              {shot.lead_note && (

                <p
                  style={{
                    color:
                      "#F59E0B"
                  }}
                >
                  Lead Note:
                  {" "}
                  {
                    shot.lead_note
                  }
                </p>
              )}

              {shot.supervisor_note && (

                <p
                  style={{
                    color:
                      "#EF4444"
                  }}
                >
                  Supervisor
                  Note:
                  {" "}
                  {
                    shot.supervisor_note
                  }
                </p>
              )}

              {shot.status
                ?.toLowerCase() ===
              "lead_approved" && (

                <div
                  style={{
                    marginTop:
                      "20px",
                    display:
                      "flex",
                    gap:
                      "10px"
                  }}
                >

                  <button
                    onClick={
                      async () => {

                        await fetch(
                          `http://127.0.0.1:8000/workflow/shot/${shot.id}`,
                          {
                            method:
                              "PUT",

                            headers: {
                              "Content-Type":
                                "application/json"
                            },

                            body:
                              JSON.stringify({
                                status:
                                  "APPROVED"
                              })
                          }
                        )

                        window.location.reload()
                      }
                    }
                    style={{
                      background:
                        "#16A34A",
                      border:
                        "none",
                      color:
                        "white",
                      padding:
                        "10px 16px",
                      borderRadius:
                        "10px"
                    }}
                  >
                    Approve
                  </button>

                  <button
                    onClick={
                      async () => {

                        const supervisor_note =
                          prompt(
                            "Supervisor feedback"
                          ) || ""

                        await fetch(
                          `http://127.0.0.1:8000/workflow/shot/${shot.id}`,
                          {
                            method:
                              "PUT",

                            headers: {
                              "Content-Type":
                                "application/json"
                            },

                            body:
                              JSON.stringify({
                                status:
                                  "SUP_KICKBACK",

                                supervisor_note
                              })
                          }
                        )

                        window.location.reload()
                      }
                    }
                    style={{
                      background:
                        "#DC2626",
                      border:
                        "none",
                      color:
                        "white",
                      padding:
                        "10px 16px",
                      borderRadius:
                        "10px"
                    }}
                  >
                    Kickback
                  </button>

                </div>
              )}

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
                    onClick={() =>
                      openPreview(
                        version
                      )
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
                      File:
                      {" "}
                      {
                        version.fileName
                      }
                    </p>

                    <p>
                      Notes:
                      {" "}
                      {
                        version.notes
                      }
                    </p>

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
                  style={
                    addBtn
                  }
                >
                  Upload
                  Version
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
              Add Shot
            </h2>

            <input
              placeholder=
              "Shot Name"
              value={
                shotName
              }
              onChange={(
                e
              ) =>
                setShotName(
                  e.target
                    .value
                )
              }
              style={
                inputStyle
              }
            />

            <select
              value={
                artist
              }
              onChange={(
                e
              ) =>
                setArtist(
                  e.target
                    .value
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
              value={
                status
              }
              onChange={(
                e
              ) =>
                setStatus(
                  e.target
                    .value
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
                    key={
                      item
                    }
                  >
                    {
                      item
                    }
                  </option>
                )
              )}

            </select>

            <select
              value={
                shotLevel
              }
              onChange={(
                e
              ) =>
                setShotLevel(
                  e.target
                    .value
                )
              }
              style={
                inputStyle
              }
            >

              <option>
                Junior
              </option>

              <option>
                Mid
              </option>

              <option>
                Senior
              </option>

              <option>
                Hero
              </option>

            </select>

              <input
  placeholder=
  "Input Path"
  value={
    inputPath
  }
  onChange={(
    e
  ) =>
    setInputPath(
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
  "Work Path"
  value={
    workPath
  }
  onChange={(
    e
  ) =>
    setWorkPath(
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
  "Publish Path"
  value={
    publishPath
  }
  onChange={(
    e
  ) =>
    setPublishPath(
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
  "Output Path"
  value={
    outputPath
  }
  onChange={(
    e
  ) =>
    setOutputPath(
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
                dueDate
              }
              onChange={(
                e
              ) =>
                setDueDate(
                  e.target
                    .value
                )
              }
              style={
                inputStyle
              }
            />

            <textarea
              placeholder=
              "Version Notes"
              value={
                notes
              }
              onChange={(
                e
              ) =>
                setNotes(
                  e.target
                    .value
                )
              }
              style={{
                ...inputStyle,
                minHeight:
                  "90px"
              }}
            />

            <button
              onClick={
                saveShot
              }
              style={
                saveBtn
              }
            >
              Save Shot
            </button>

          </div>

        </div>
      )}

      {previewOpen &&
      previewFile && (

        <div
          style={{
            position:
              "fixed",
            top: 0,
            left: 0,
            width:
              "100%",
            height:
              "100%",
            background:
              "rgba(0,0,0,0.95)",
            display:
              "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
            zIndex:
              9999
          }}
        >

          <div
            style={{
              width:
                "80%",
              maxWidth:
                "900px",
              background:
                "#171717",
              padding:
                "20px",
              borderRadius:
                "20px",
              position:
                "relative"
            }}
          >

            <button
              onClick={() =>
                setPreviewOpen(
                  false
                )
              }
              style={{
                position:
                  "absolute",
                top:
                  "20px",
                right:
                  "20px",
                background:
                  "#DC2626",
                border:
                  "none",
                color:
                  "white",
                padding:
                  "10px 14px",
                borderRadius:
                  "10px",
                cursor:
                  "pointer"
              }}
            >
              Close
            </button>

            <h2>
              {
                previewFile
                  .fileName
              }
            </h2>

            <p>
              {
                previewFile
                  .notes
              }
            </p>

          </div>

        </div>
      )}

    </div>
  )
}

const shotCard = {
  background:
    "#171717",
  padding:
    "20px",
  borderRadius:
    "20px",
  marginBottom:
    "20px"
}

const versionCard = {
  background:
    "#252525",
  padding:
    "12px",
  borderRadius:
    "12px",
  marginTop:
    "10px",
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
    "450px",
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

const saveBtn = {
  width:
    "100%",
  padding:
    "12px",
  marginTop:
    "20px",
  background:
    "#FF7A00",
  border:
    "none",
  color:
    "white",
  borderRadius:
    "10px",
  cursor:
    "pointer"
}