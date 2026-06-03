import { useEffect, useState }
from "react"

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

  clientReview?: string
  clientNotes?: string
  reviewHistory?: any[]
  supervisorReview?: any

  versions?: Version[]
}

type User = {
  email: string
  role: string
  name: string
}

export default function ArtistShots() {

  const [shots,
    setShots] =
    useState<
      (Shot & {
        projectId: string
      })[]
    >([])

  const [user,
    setUser] =
    useState<User | null>(
      null
    )

  const loadShots =
    (
      savedUser:
        User
    ) => {

      const assignedShots:
        (Shot & {
          projectId: string
        })[] = []

      Object.keys(
        localStorage
      ).forEach(
        (
          key
        ) => {

          if (
            key.startsWith(
              "pbs_shots_"
            )
          ) {

            const projectId =
              key.replace(
                "pbs_shots_",
                ""
              )

            const savedShots:
              Shot[] =
              JSON.parse(
                localStorage.getItem(
                  key
                ) || "[]"
              )

            savedShots.forEach(
              (
                shot
              ) => {

                if (
                  shot.artist
                    ?.toLowerCase() ===
                  savedUser.name
                    .toLowerCase()
                ) {

                  assignedShots.push({
                    ...shot,
                    projectId
                  })
                }
              }
            )
          }
        }
      )

      setShots(
        assignedShots
      )
    }

  useEffect(() => {

    const savedUser =
      JSON.parse(
        localStorage.getItem(
          "pbs_user"
        ) || "null"
      )

    if (
      !savedUser
    ) return

    setUser(
      savedUser
    )

    loadShots(
      savedUser
    )

  }, [])

  const uploadVersion =
    (
      shotName:
        string
    ) => {

      const file =
        prompt(
          "File Name"
        )

      if (!file)
        return

      const notes =
        prompt(
          "Version Notes"
        ) || ""

      const updated =
        [...shots]

      const index =
        updated.findIndex(
          (
            shot
          ) =>
            shot.name ===
            shotName
        )

      if (
        index === -1
      ) return

      if (
        !updated[index]
          .versions
      ) {

        updated[index]
          .versions = []
      }

      const versionCount =
        updated[index]
          .versions!
          .length + 1

      updated[index]
        .versions!
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

        notes,

        uploadedAt:
          new Date()
            .toLocaleString()
      })

      setShots(
        [...updated]
      )

      updated.forEach(
        (
          shot
        ) => {

          const storageKey =
            `pbs_shots_${shot.projectId}`

          const existingShots:
            any[] =
            JSON.parse(
              localStorage.getItem(
                storageKey
              ) || "[]"
            )

          const updatedShots =
            existingShots.map(
              (
                existingShot
              ) => {

                if (
                  existingShot.name ===
                  shot.name
                ) {

                  return {
                    ...existingShot,
                    versions:
                      shot.versions
                  }
                }

                return existingShot
              }
            )

          localStorage.setItem(
            storageKey,
            JSON.stringify(
              updatedShots
            )
          )
        }
      )

      alert(
        "Version Uploaded"
      )

      if (
        user
      ) {

        loadShots(
          user
        )
      }
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

      <h1>
        My Shots
      </h1>

      <p
        style={{
          color:
            "#888"
        }}
      >
        Welcome,
        {" "}
        {
          user?.name
        }
      </p>

      <div
        style={{
          marginTop:
            "30px"
        }}
      >

        {shots.map(
          (
            shot
          ) => (

            <div
              key={
                shot.name
              }
              style={{
                background:
                  "#171717",
                padding:
                  "20px",
                borderRadius:
                  "20px",
                marginBottom:
                  "20px"
              }}
            >

              <h2>
                {
                  shot.name
                }
              </h2>

              <p>
                Status:
                {" "}
                {
                  shot.status
                }
              </p>

              <p>
                Due:
                {" "}
                {
                  shot.dueDate
                }
              </p>

              <p>
                Versions:
                {" "}
                {
                  shot.versions
                    ?.length || 0
                }
              </p>

              <button
                onClick={() =>
                  uploadVersion(
                    shot.name
                  )
                }
                style={{
                  background:
                    "#FF7A00",
                  border:
                    "none",
                  color:
                    "white",
                  padding:
                    "12px 18px",
                  borderRadius:
                    "10px",
                  cursor:
                    "pointer",
                  marginTop:
                    "15px"
                }}
              >
                Upload Version
              </button>

            </div>
          )
        )}

      </div>

    </div>
  )
}

