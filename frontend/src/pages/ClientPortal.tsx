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
  notes: string
  uploadedAt: string
}

type Shot = {
  name: string
  artist: string
  status: string
  priority: string
  dueDate: string
  versions?: Version[]
  clientReview?: string
  clientNotes?: string
  reviewHistory?: Review[]
  projectId: string
}

export default function ClientPortal() {

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
                shot:
                  any
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

  const addReview =
    (
      shotName:
        string,
      projectId:
        string
    ) => {

      const review =
        prompt(
          "Approved / Retake"
        )

      if (
        !review
      ) return

      const note =
        prompt(
          "Client Notes"
        ) || ""

      const storageKey =
        `pbs_shots_${projectId}`

      const savedShots =
        JSON.parse(
          localStorage.getItem(
            storageKey
          ) || "[]"
        )

      const updatedShots =
        savedShots.map(
          (
            shot:
              any
          ) => {

            if (
              shot.name ===
              shotName
            ) {

              return {

                ...shot,

                clientReview:
                  review,

                clientNotes:
                  note,

                reviewHistory:
                  [
                    ...(
                      shot.reviewHistory ||
                      []
                    ),

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
            }

            return shot
          }
        )

      localStorage.setItem(
        storageKey,
        JSON.stringify(
          updatedShots
        )
      )

      alert(
        "Review Submitted"
      )

      loadShots()
    }

  const getReviewColor =
    (
      review:
        string
    ) => {

      switch (
        review
      ) {

        case
          "Approved":

          return
            "#16A34A"

        case
          "Retake":

          return
            "#DC2626"

        default:

          return
            "#6B7280"
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
        Client Portal
      </h1>

      <p
        style={{
          color:
            "#888"
        }}
      >
        Review &
        Approval
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
                `${shot.projectId}-${shot.name}`
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
                Due:
                {" "}
                {
                  shot.dueDate
                }
              </p>

              <h3
                style={{
                  marginTop:
                    "20px"
                }}
              >
                Versions
              </h3>

              {(shot.versions ||
                []).map(
                (
                  version
                ) => (

                  <div
                    key={
                      version.id
                    }
                    style={{
                      background:
                        "#252525",
                      padding:
                        "12px",
                      borderRadius:
                        "12px",
                      marginTop:
                        "10px"
                    }}
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
                  marginTop:
                    "20px"
                }}
              >

                <strong>
                  Current Review:
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

              </div>

              {shot.clientNotes && (

                <p
                  style={{
                    marginTop:
                      "15px"
                  }}
                >
                  Notes:
                  {" "}
                  {
                    shot.clientNotes
                  }
                </p>
              )}

              <button
                onClick={() =>
                  addReview(
                    shot.name,
                    shot.projectId
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
                    "12px 20px",
                  borderRadius:
                    "10px",
                  cursor:
                    "pointer",
                  marginTop:
                    "20px"
                }}
              >
                Review Shot
              </button>

            </div>
          )
        )}

      </div>

    </div>
  )
}
