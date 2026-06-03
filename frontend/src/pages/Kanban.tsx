import { useEffect, useState } from "react"

type Shot = {
  name: string
  artist: string
  status: string
  priority: string
  dueDate: string
}

const columns = [
  "Assigned",
  "WIP",
  "Review",
  "Retake",
  "Approved",
  "Delivered"
]

export default function Kanban() {

  const [shots,
    setShots] =
    useState<
      (Shot & {
        projectId: string
      })[]
    >([])

  useEffect(() => {

    const allShots:
      (Shot & {
        projectId: string
      })[] = []

    Object.keys(
      localStorage
    ).forEach(
      (key) => {

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

          const savedShots =
            JSON.parse(
              localStorage.getItem(
                key
              ) || "[]"
            )

          savedShots.forEach(
            (
              shot: Shot
            ) => {

              allShots.push({
                ...shot,
                projectId
              })
            }
          )
        }
      }
    )

    setShots(
      allShots
    )

  }, [])

  const moveShot =
    (
      shotName:
        string,
      newStatus:
        string
    ) => {

      const updated =
        [...shots]

      const shotIndex =
        updated.findIndex(
          (
            shot
          ) =>
            shot.name ===
            shotName
        )

      if (
        shotIndex === -1
      )
        return

      updated[
        shotIndex
      ].status =
        newStatus

      setShots(
        updated
      )

      const grouped:
        Record<
          string,
          Shot[]
        > = {}

      updated.forEach(
        (
          shot
        ) => {

          if (
            !grouped[
              shot.projectId
            ]
          ) {

            grouped[
              shot.projectId
            ] = []
          }

          grouped[
            shot.projectId
          ].push({
            name:
              shot.name,
            artist:
              shot.artist,
            status:
              shot.status,
            priority:
              shot.priority,
            dueDate:
              shot.dueDate
          })
        }
      )

      Object.keys(
        grouped
      ).forEach(
        (
          projectId
        ) => {

          localStorage.setItem(
            `pbs_shots_${projectId}`,
            JSON.stringify(
              grouped[
                projectId
              ]
            )
          )
        }
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
          "20px"
      }}
    >

      <h1>
        Production
        Kanban
      </h1>

      <p
        style={{
          color:
            "#888"
        }}
      >
        Drag style
        pipeline board
      </p>

      <div
        style={{
          display:
            "flex",
          gap:
            "20px",
          overflowX:
            "auto",
          marginTop:
            "30px"
        }}
      >

        {columns.map(
          (
            column
          ) => (

            <div
              key={column}
              style={{
                minWidth:
                  "320px",
                background:
                  "#171717",
                borderRadius:
                  "20px",
                padding:
                  "20px"
              }}
            >

              <h2>
                {
                  column
                }
              </h2>

              {shots
                .filter(
                  (
                    shot
                  ) =>
                    shot.status ===
                    column
                )
                .map(
                  (
                    shot
                  ) => (

                    <div
                      key={
                        shot.name
                      }
                      style={{
                        background:
                          "#252525",
                        padding:
                          "16px",
                        borderRadius:
                          "16px",
                        marginTop:
                          "15px"
                      }}
                    >

                      <h3>
                        {
                          shot.name
                        }
                      </h3>

                      <p>
                        Artist:
                        {" "}
                        {
                          shot.artist
                        }
                      </p>

                      <p>
                        Due:
                        {" "}
                        {
                          shot.dueDate
                        }
                      </p>

                      <select
                        value={
                          shot.status
                        }
                        onChange={(
                          e
                        ) =>
                          moveShot(
                            shot.name,
                            e.target
                              .value
                          )
                        }
                        style={{
                          width:
                            "100%",
                          padding:
                            "10px",
                          borderRadius:
                            "10px",
                          background:
                            "#111",
                          color:
                            "white",
                          border:
                            "1px solid #333"
                        }}
                      >

                        {columns.map(
                          (
                            item
                          ) => (

                            <option
                              key={
                                item
                              }
                              value={
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

                    </div>
                  )
                )}

            </div>
          )
        )}

      </div>

    </div>
  )
}
