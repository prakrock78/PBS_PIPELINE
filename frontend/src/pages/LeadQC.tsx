import {
  useEffect,
  useState
} from "react"

type Shot = {
  id?: number
  name: string
  artist: string
  status: string
  priority?: string
}

export default function LeadQC() {

  const [shots,
    setShots] =
    useState<Shot[]>(
      []
    )

  const [filter,
    setFilter] =
    useState(
      "all"
    )

  const loadShots =
    async () => {

      try {

        const response =
          await fetch(
            "http://127.0.0.1:8000/shots"
          )

        const data =
          await response.json()

        setShots(
          data
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
      id: number,
      status: string
    ) => {
      let lead_note = ""

    if (
      status ===
      "LEAD_KICKBACK"
    ) {

      lead_note =
        prompt(
          "Lead feedback"
        ) || ""
    }
      await fetch(
        `http://127.0.0.1:8000/workflow/shot/${id}`,
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
    }

  const filteredShots =
    shots.filter(
      (
        shot
      ) => {

        if (
          filter ===
          "all"
        ) {

          return true
        }

        return (
          shot.status
            ?.toLowerCase() ===
          filter
        )
      }
    )

  const totalShots =
    shots.length

  const wipShots =
    shots.filter(
      (
        s
      ) =>
        s.status
          ?.toLowerCase() ===
        "wip"
    ).length

  const doneShots =
    shots.filter(
      (
        s
      ) =>
        s.status
          ?.toLowerCase() ===
        "done"
    ).length

  const kickbacks =
    shots.filter(
      (
        s
      ) =>
        s.status
          ?.toLowerCase()
          .includes(
            "kickback"
          )
    ).length

  const approved =
    shots.filter(
      (
        s
      ) =>
        s.status
          ?.toLowerCase() ===
        "lead_approved"
    ).length

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
        Lead Dashboard
      </h1>

      <div
        style={{
          display:
            "flex",
          gap:
            "15px",
          marginTop:
            "20px",
          flexWrap:
            "wrap"
        }}
      >

        <div style={card}>
          Total:
          {" "}
          {
            totalShots
          }
        </div>

        <div style={card}>
          WIP:
          {" "}
          {
            wipShots
          }
        </div>

        <div style={card}>
          Done:
          {" "}
          {
            doneShots
          }
        </div>

        <div style={card}>
          Kickback:
          {" "}
          {
            kickbacks
          }
        </div>

        <div style={card}>
          Approved:
          {" "}
          {
            approved
          }
        </div>

      </div>

      <div
        style={{
          marginTop:
            "25px",
          display:
            "flex",
          gap:
            "10px",
          flexWrap:
            "wrap"
        }}
      >

        {[
          "all",
          "assigned",
          "wip",
          "done",
          "lead_kickback",
          "lead_approved"
        ].map(
          (
            item
          ) => (

            <button
              key={
                item
              }
              onClick={() =>
                setFilter(
                  item
                )
              }
              style={{
                background:
                  filter ===
                  item
                    ? "#FF7A00"
                    : "#252525",
                color:
                  "white",
                border:
                  "none",
                padding:
                  "10px 16px",
                borderRadius:
                  "10px",
                cursor:
                  "pointer"
              }}
            >
              {
                item
              }
            </button>
          )
        )}

      </div>

      {filteredShots.map(
        (
          shot
        ) => (

          <div
            key={
              shot.id
            }
            style={{
              background:
                "#171717",
              padding:
                "20px",
              marginTop:
                "20px",
              borderRadius:
                "16px"
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

            {shot.status
              ?.toLowerCase() ===
            "done" && (

              <div
                style={{
                  marginTop:
                    "15px",
                  display:
                    "flex",
                  gap:
                    "10px"
                }}
              >

                <button
                  onClick={() =>
                    updateStatus(
                      shot.id!,
                      "LEAD_APPROVED"
                    )
                  }
                >
                  Lead Approve
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      shot.id!,
                      "LEAD_KICKBACK"
                    )
                  }
                >
                  Kickback
                </button>

              </div>
            )}

          </div>
        )
      )}

    </div>
  )
}

const card = {
  background:
    "#171717",
  padding:
    "18px",
  borderRadius:
    "14px",
  minWidth:
    "140px"
}
