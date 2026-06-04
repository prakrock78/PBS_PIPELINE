import {
  useEffect,
  useState
} from "react"

type Shot = {
  id?: number
  name: string
  artist: string
  status: string
  priority: string
  due_date: string
  lead_note?: string
  supervisor_note?: string
}

export default function ArtistShots() {

  const [shots,
    setShots] =
    useState<Shot[]>(
      []
    )

  const loadShots =
    async () => {

      const user =
        JSON.parse(
          localStorage.getItem(
            "pbs_user"
          ) || "{}"
        )

      try {

        const response =
          await fetch(
            "http://127.0.0.1:8000/shots"
          )

        const data =
          await response.json()

        const assignedShots =
          data.filter(
            (
              shot: any
            ) =>
              shot.artist
                ?.toLowerCase()
                .includes(
              user.name
                ?.toLowerCase()
                .trim()
          )

        )

        setShots(
          assignedShots
        )

      } catch {

        alert(
          "Failed to load shots"
        )
      }
    }

  useEffect(() => {

    loadShots()

  }, [])

  const updateStatus =
    async (
      shotId:
        number,
      status:
        string
    ) => {

      try {

        await fetch(
          `http://127.0.0.1:8000/workflow/shot/${shotId}`,
          {
            method:
              "PUT",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({
                status
              })
          }
        )

        loadShots()

      } catch {

        alert(
          "Status update failed"
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

      {shots.length ===
      0 ? (

        <p
          style={{
            color:
              "#888"
          }}
        >
          No shot assigned
        </p>

      ) : (

        shots.map(
          (
            shot,
            index
          ) => (

            <div
              key={
                index
              }
              style={{
                background:
                  "#171717",
                padding:
                  "20px",
                borderRadius:
                  "16px",
                marginTop:
                  "20px"
              }}
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
                Status:
                {" "}
                {
                  shot.status
                }
              </p>

              <p>
                Priority:
                {" "}
                {
                  shot.priority
                }
              </p>

              <p>
                Due Date:
                {" "}
                {
                  shot.due_date
                }
              </p>

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

                {shot.status
                  ?.toLowerCase() ===
                "assigned" && (

                  <button
                    onClick={() =>
                      updateStatus(
                        shot.id!,
                        "WIP"
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
                        "10px 16px",
                      borderRadius:
                        "10px",
                      cursor:
                        "pointer"
                    }}
                  >
                    Start Work
                  </button>
                )}

                {shot.status
                  ?.toLowerCase() ===
                "wip" && (

                  <button
                    onClick={() =>
                      updateStatus(
                        shot.id!,
                        "DONE"
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
                        "10px 16px",
                      borderRadius:
                        "10px",
                      cursor:
                        "pointer"
                    }}
                  >
                    Mark Done
                  </button>
                )}

                {(
  shot.status
    ?.toLowerCase() ===
  "lead_kickback" ||

  shot.status
    ?.toLowerCase() ===
  "sup_kickback"
) && (

  <button
    onClick={() =>
      updateStatus(
        shot.id!,
        "WIP"
      )
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
        "10px",
      cursor:
        "pointer"
    }}
  >
    Rework Shot
  </button>
)}

              </div>

            </div>
          )
        )
      )}

    </div>
  )
}