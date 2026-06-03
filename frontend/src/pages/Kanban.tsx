import {
  useEffect,
  useState
} from "react"

import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd"

type Shot = {
  name: string
  artist: string
  status: string
  priority: string
  dueDate: string
  projectId: string
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
    useState<Shot[]>(
      []
    )

  const loadShots =
    () => {

      const allShots:
        Shot[] = []

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

            const savedShots =
              JSON.parse(
                localStorage.getItem(
                  key
                ) || "[]"
              )

            savedShots.forEach(
              (
                shot: any
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
    }

  useEffect(() => {

    loadShots()

  }, [])

  const saveShots =
    (
      updated:
        Shot[]
    ) => {

      const grouped:
        Record<
          string,
          any[]
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
            ...shot
          })
        }
      )

      Object.keys(
        grouped
      ).forEach(
        (
          projectId
        ) => {

          const cleaned =
            grouped[
              projectId
            ].map(
              (
                shot
              ) => {

                const {
                  projectId,
                  ...rest
                } = shot

                return rest
              }
            )

          localStorage.setItem(
            `pbs_shots_${projectId}`,
            JSON.stringify(
              cleaned
            )
          )
        }
      )
    }

  const onDragEnd =
    (
      result:
        any
    ) => {

      if (
        !result.destination
      ) return

      const shotName =
        result
          .draggableId

      const newStatus =
        result
          .destination
          .droppableId

      const updated =
        shots.map(
          (
            shot
          ) => {

            if (
              shot.name ===
              shotName
            ) {

              return {
                ...shot,
                status:
                  newStatus
              }
            }

            return shot
          }
        )

      setShots(
        updated
      )

      saveShots(
        updated
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
        Real Drag &
        Drop
        Pipeline
      </p>

      <DragDropContext
        onDragEnd={
          onDragEnd
        }
      >

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

              <Droppable
                key={
                  column
                }
                droppableId={
                  column
                }
              >

                {(
                  provided
                ) => (

                  <div
                    ref={
                      provided.innerRef
                    }
                    {
                      ...provided.droppableProps
                    }
                    style={{
                      minWidth:
                        "320px",
                      background:
                        "#171717",
                      borderRadius:
                        "20px",
                      padding:
                        "20px",
                      minHeight:
                        "500px"
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
                          shot,
                          index
                        ) => (

                          <Draggable
                            key={
                              shot.name
                            }
                            draggableId={
                              shot.name
                            }
                            index={
                              index
                            }
                          >

                            {(
                              provided
                            ) => (

                              <div
                                ref={
                                  provided.innerRef
                                }
                                {
                                  ...provided.draggableProps
                                }
                                {
                                  ...provided.dragHandleProps
                                }
                                style={{
                                  background:
                                    "#252525",
                                  padding:
                                    "16px",
                                  borderRadius:
                                    "16px",
                                  marginTop:
                                    "15px",
                                  cursor:
                                    "grab",
                                  ...provided
                                    .draggableProps
                                    .style
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

                                <p>
                                  Priority:
                                  {" "}
                                  {
                                    shot.priority
                                  }
                                </p>

                              </div>
                            )}

                          </Draggable>
                        )
                      )}

                    {
                      provided.placeholder
                    }

                  </div>
                )}

              </Droppable>
            )
          )}

        </div>

      </DragDropContext>

    </div>
  )
}
