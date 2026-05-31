import { useEffect, useState }
from "react"

import { useNavigate }
from "react-router-dom"

type Shot = {
  status: string
  dueDate?: string
}

export default function Dashboard() {

  const navigate =
    useNavigate()

  const [projectCount,
    setProjectCount] =
    useState(0)

  const [artistCount,
    setArtistCount] =
    useState(0)

  const [totalShots,
    setTotalShots] =
    useState(0)

  const [wipShots,
    setWipShots] =
    useState(0)

  const [reviewShots,
    setReviewShots] =
    useState(0)

  const [deliveredShots,
    setDeliveredShots] =
    useState(0)

  const [dueToday,
    setDueToday] =
    useState(0)

  const [dueTomorrow,
    setDueTomorrow] =
    useState(0)

  const [overdue,
    setOverdue] =
    useState(0)

  useEffect(() => {

    /* Projects */

    const projects =
      JSON.parse(
        localStorage.getItem(
          "pbs_projects"
        ) || "[]"
      )

    setProjectCount(
      projects.length
    )

    /* Artists */

    const artists =
      JSON.parse(
        localStorage.getItem(
          "pbs_artists"
        ) || "[]"
      )

    setArtistCount(
      artists.length
    )

    let shotCount =
      0

    let wip =
      0

    let review =
      0

    let delivered =
      0

    let todayCount =
      0

    let tomorrowCount =
      0

    let overdueCount =
      0

    const today =
      new Date()

    today.setHours(
      0, 0, 0, 0
    )

    const tomorrow =
      new Date()

    tomorrow.setDate(
      today.getDate() + 1
    )

    tomorrow.setHours(
      0, 0, 0, 0
    )

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

          const shots:
            Shot[] =
            JSON.parse(
              localStorage.getItem(
                key
              ) || "[]"
            )

          shotCount +=
            shots.length

          shots.forEach(
            (
              shot
            ) => {

              if (
                shot.status ===
                "WIP"
              ) {
                wip++
              }

              if (
                shot.status ===
                "Review"
              ) {
                review++
              }

              if (
                shot.status ===
                "Delivered"
              ) {
                delivered++
              }

              if (
                shot.dueDate
              ) {

                const due =
                  new Date(
                    shot.dueDate
                  )

                due.setHours(
                  0,0,0,0
                )

                if (
                  due.getTime() ===
                  today.getTime()
                ) {
                  todayCount++
                }

                if (
                  due.getTime() ===
                  tomorrow.getTime()
                ) {
                  tomorrowCount++
                }

                if (
                  due <
                  today &&
                  shot.status !==
                  "Delivered"
                ) {
                  overdueCount++
                }
              }
            }
          )
        }
      }
    )

    setTotalShots(
      shotCount
    )

    setWipShots(
      wip
    )

    setReviewShots(
      review
    )

    setDeliveredShots(
      delivered
    )

    setDueToday(
      todayCount
    )

    setDueTomorrow(
      tomorrowCount
    )

    setOverdue(
      overdueCount
    )

  }, [])

  return (

    <div
      style={{
        display:
          "flex",
        background:
          "#0B0B0B",
        minHeight:
          "100vh",
        color:
          "white",
        fontFamily:
          "Arial"
      }}
    >

      {/* Sidebar */}

      <div
        style={{
          width:
            "250px",
          background:
            "#151515",
          padding:
            "25px",
          borderRight:
            "1px solid #222"
        }}
      >

        <h1
          style={{
            color:
              "#FF7A00",
            marginBottom:
              "40px"
          }}
        >
          PBS
        </h1>

        <div
          style={menuItem}
          onClick={() =>
            navigate(
              "/dashboard"
            )
          }
        >
          Dashboard
        </div>

        <div
          style={menuItem}
          onClick={() =>
            navigate(
              "/projects"
            )
          }
        >
          Projects
        </div>

        <div
          style={menuItem}
          onClick={() =>
            navigate(
              "/artists"
            )
          }
        >
          Artists
        </div>

      </div>

      {/* Main */}

      <div
        style={{
          flex: 1,
          padding:
            "30px"
        }}
      >

        <h1>
          Production Dashboard
        </h1>

        <p
          style={{
            color:
              "#888"
            }}
        >
          Live Pipeline Stats
        </p>

        {overdue > 0 && (

          <div
            style={{
              background:
                "#DC2626",
              padding:
                "15px",
              borderRadius:
                "15px",
              marginTop:
                "20px",
              fontWeight:
                "bold"
            }}
          >
            ⚠ {overdue}
            {" "}
            Overdue Shots
          </div>
        )}

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

          <div style={card}>
            <h3>Projects</h3>
            <h1>{projectCount}</h1>
          </div>

          <div style={card}>
            <h3>Artists</h3>
            <h1>{artistCount}</h1>
          </div>

          <div style={card}>
            <h3>Total Shots</h3>
            <h1>{totalShots}</h1>
          </div>

          <div style={card}>
            <h3>WIP</h3>
            <h1>{wipShots}</h1>
          </div>

          <div style={card}>
            <h3>Review</h3>
            <h1>{reviewShots}</h1>
          </div>

          <div style={card}>
            <h3>Delivered</h3>
            <h1>{deliveredShots}</h1>
          </div>

          <div style={card}>
            <h3>📅 Due Today</h3>
            <h1>{dueToday}</h1>
          </div>

          <div style={card}>
            <h3>⏰ Tomorrow</h3>
            <h1>{dueTomorrow}</h1>
          </div>

          <div
            style={{
              ...card,
              border:
                overdue > 0
                  ? "2px solid red"
                  : "none"
            }}
          >
            <h3>
              ⚠ Overdue
            </h3>

            <h1>
              {overdue}
            </h1>
          </div>

        </div>

      </div>

    </div>
  )
}

const menuItem = {
  padding:
    "14px",
  cursor:
    "pointer",
  marginBottom:
    "10px",
  borderRadius:
    "10px",
  background:
    "#1C1C1C"
}

const card = {
  background:
    "#171717",
  padding:
    "20px",
  borderRadius:
    "20px"
}
