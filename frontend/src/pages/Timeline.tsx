import {
  useEffect,
  useState
} from "react"

type Shot = {
  name: string
  artist: string
  status: string
  priority: string
  dueDate: string
  projectId: string
}

export default function Timeline() {

  const [shots,
    setShots] =
    useState<Shot[]>(
      []
    )

  useEffect(() => {

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

    const sorted =
      allShots.sort(
        (
          a,
          b
        ) =>
          new Date(
            a.dueDate
          ).getTime()
          -
          new Date(
            b.dueDate
          ).getTime()
      )

    setShots(
      sorted
    )

  }, [])

  const getStatusColor =
    (
      dueDate:
        string,
      status:
        string
    ) => {

      const today =
        new Date()

      today.setHours(
        0,0,0,0
      )

      const tomorrow =
        new Date()

      tomorrow.setDate(
        today.getDate() + 1
      )

      tomorrow.setHours(
        0,0,0,0
      )

      const due =
        new Date(
          dueDate
        )

      due.setHours(
        0,0,0,0
      )

      if (
        status ===
        "Delivered"
      ) {

        return "#16A34A"
      }

      if (
        due <
        today
      ) {

        return "#DC2626"
      }

      if (
        due.getTime() ===
        today.getTime()
      ) {

        return "#F97316"
      }

      if (
        due.getTime() ===
        tomorrow.getTime()
      ) {

        return "#EAB308"
      }

      return "#2563EB"
    }

  const getLabel =
    (
      dueDate:
        string,
      status:
        string
    ) => {

      const today =
        new Date()

      today.setHours(
        0,0,0,0
      )

      const tomorrow =
        new Date()

      tomorrow.setDate(
        today.getDate() + 1
      )

      tomorrow.setHours(
        0,0,0,0
      )

      const due =
        new Date(
          dueDate
        )

      due.setHours(
        0,0,0,0
      )

      if (
        status ===
        "Delivered"
      ) {

        return "Delivered"
      }

      if (
        due <
        today
      ) {

        return "Overdue"
      }

      if (
        due.getTime() ===
        today.getTime()
      ) {

        return "Due Today"
      }

      if (
        due.getTime() ===
        tomorrow.getTime()
      ) {

        return "Tomorrow"
      }

      return "Upcoming"
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
        Timeline
      </h1>

      <p
        style={{
          color:
            "#888"
        }}
      >
        Deadline
        Tracker
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
                  "20px",
                border:
                  `2px solid ${getStatusColor(
                    shot.dueDate,
                    shot.status
                  )}`
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

                </div>

                <div
                  style={{
                    background:
                      getStatusColor(
                        shot.dueDate,
                        shot.status
                      ),
                    padding:
                      "10px 18px",
                    borderRadius:
                      "10px",
                    fontWeight:
                      "bold"
                  }}
                >
                  {
                    getLabel(
                      shot.dueDate,
                      shot.status
                    )
                  }
                </div>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  )
}
