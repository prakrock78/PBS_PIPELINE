import {
  useEffect,
  useState
} from "react"

import {
  useNavigate
} from "react-router-dom"

type Shot = {
  status: string
  dueDate?: string
  artist?: string
  clientReview?: string
  supervisorReview?: {
    status: string
    notes: string
  }
}

type User = {
  email: string
  role: string
  name: string
}

type Notification = {
  id: number
  title: string
  type: string
}

type Analytics = {
  completionRate: number
  deliveryRate: number
  overdueRate: number
  avgTimeline: number
}

export default function Dashboard() {

  const navigate =
    useNavigate()

  const [user,
    setUser] =
    useState<User | null>(
      null
    )

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

  const [notifications,
    setNotifications] =
    useState<
      Notification[]
    >([])

  const [showNotifications,
    setShowNotifications] =
    useState(false)

  const [analytics,
    setAnalytics] =
    useState<Analytics>({
      completionRate:
        0,
      deliveryRate:
        0,
      overdueRate:
        0,
      avgTimeline:
        0
    })

  const [artistWorkload,
    setArtistWorkload] =
    useState<
      Record<
        string,
        number
      >
    >({})

  useEffect(() => {

    const savedUser =
      JSON.parse(
        localStorage.getItem(
          "pbs_user"
        ) || "null"
      )

    if (
      !savedUser
    ) {

      navigate("/")
      return
    }

    setUser(
      savedUser
    )

    const projects =
      JSON.parse(
        localStorage.getItem(
          "pbs_projects"
        ) || "[]"
      )

    setProjectCount(
      projects.length
    )

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

    let wip = 0
    let review = 0
    let delivered = 0
    let approved = 0

    let todayCount =
      0

    let tomorrowCount =
      0

    let overdueCount =
      0

    const workload:
      Record<
        string,
        number
      > = {}

    const alerts:
      Notification[] =
      []

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

          const filteredShots =
            savedUser.role ===
            "artist"

              ? shots.filter(
                  (
                    shot
                  ) =>
                    shot.artist
                      ?.toLowerCase()
                    ===
                    savedUser
                      .name
                      .toLowerCase()
                )

              : shots

          shotCount +=
            filteredShots.length

          filteredShots.forEach(
            (
              shot
            ) => {

              if (
                shot.artist
              ) {

                workload[
                  shot.artist
                ] = (
                  workload[
                    shot.artist
                  ] || 0
                ) + 1
              }

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
                shot.status ===
                "Approved"
              ) {
                approved++
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

                  alerts.push({
                    id:
                      Date.now() +
                      Math.random(),

                    title:
                      "Overdue Shot",

                    type:
                      "overdue"
                  })
                }
              }

              if (
                savedUser.role !==
                "artist"
              ) {

                if (
                  shot
                    .supervisorReview
                    ?.status ===
                  "Pending"
                ) {

                  alerts.push({
                    id:
                      Date.now() +
                      Math.random(),

                    title:
                      "Supervisor Review Pending",

                    type:
                      "supervisor"
                  })
                }

                if (
                  shot.clientReview ===
                    "Pending" ||
                  !shot.clientReview
                ) {

                  alerts.push({
                    id:
                      Date.now() +
                      Math.random(),

                    title:
                      "Client Review Pending",

                    type:
                      "client"
                  })
                }
              }
            }
          )
        }
      }
    )

    setNotifications(
      alerts
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

    setArtistWorkload(
      workload
    )

    setAnalytics({
      completionRate:
        shotCount > 0
          ? Math.round(
              (
                approved /
                shotCount
              ) * 100
            )
          : 0,

      deliveryRate:
        shotCount > 0
          ? Math.round(
              (
                delivered /
                shotCount
              ) * 100
            )
          : 0,

      overdueRate:
        shotCount > 0
          ? Math.round(
              (
                overdueCount /
                shotCount
              ) * 100
            )
          : 0,

      avgTimeline:
        todayCount +
        tomorrowCount
    })

  }, [
    navigate
  ])

  const logout =
    () => {

      localStorage.removeItem(
        "pbs_user"
      )

      navigate("/")
    }

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

          <h1
            style={{
              color:
                "#FF7A00"
            }}
          >
            PBS
          </h1>

          <button
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
            style={{
              background:
                "#1C1C1C",
              border:
                "none",
              color:
                "white",
              borderRadius:
                "10px",
              padding:
                "10px",
              cursor:
                "pointer"
            }}
          >
            🔔
            {" "}
            {
              notifications.length
            }
          </button>

        </div>

        <p
          style={{
            color:
              "#888",
            marginBottom:
              "30px"
          }}
        >
          {
            user?.role
          }
        </p>

        <div
  style={
    menuItem
  }
  onClick={() =>
    navigate(
      "/dashboard"
    )
  }
>
  Dashboard
</div>

<div
  style={
    menuItem
  }
  onClick={() =>
    navigate(
      "/projects"
    )
  }
>
  Projects
</div>

<div
  style={
    menuItem
  }
  onClick={() =>
    navigate(
      "/artists"
    )
  }
>
  Artists
</div>

<div
  style={
    menuItem
  }
  onClick={() =>
    navigate(
      "/artist-shots"
    )
  }
>
  Shots
</div>

<div
  style={
    menuItem
  }
  onClick={() =>
    navigate(
      "/timeline"
    )
  }
>
  Timeline
</div>

{user?.role ===
  "client" && (

  <div
    style={
      menuItem
    }
    onClick={() =>
      navigate(
        "/client-portal"
      )
    }
  >
    Client Portal
  </div>
)}

<div
  style={
    menuItem
  }
  onClick={
    logout
  }
>
  Logout
</div>

      </div>

      <div
        style={{
          flex: 1,
          padding:
            "30px"
        }}
      >

        <h1
  style={{
    color:
      "white"
  }}
>
  Welcome,
  {" "}
  {
    user?.name
  }
</h1>

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(4,1fr)",
            gap:
              "20px",
            marginTop:
              "30px"
          }}
        >

          <div style={card}>
            <h3>
              Projects
            </h3>
            <h1>
              {
                projectCount
              }
            </h1>
          </div>

          <div style={card}>
            <h3>
              Artists
            </h3>
            <h1>
              {
                artistCount
              }
            </h1>
          </div>

          <div style={card}>
            <h3>
              Shots
            </h3>
            <h1>
              {
                totalShots
              }
            </h1>
          </div>

          <div style={card}>
            <h3>
              Overdue
            </h3>
            <h1>
              {
                overdue
              }
            </h1>
          </div>

        </div>

        <h2
  style={{
    marginTop:
      "40px",
    color:
      "white"
  }}
>
  Analytics
</h2>

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(4,1fr)",
            gap:
              "20px",
            marginTop:
              "20px"
          }}
        >

          <div style={card}>
            <h3>
              Completion
            </h3>
            <h1>
              {
                analytics
                  .completionRate
              }%
            </h1>
          </div>

          <div style={card}>
            <h3>
              Delivery
            </h3>
            <h1>
              {
                analytics
                  .deliveryRate
              }%
            </h1>
          </div>

          <div style={card}>
            <h3>
              Overdue
            </h3>
            <h1>
              {
                analytics
                  .overdueRate
              }%
            </h1>
          </div>

          <div style={card}>
            <h3>
              Timeline
            </h3>
            <h1>
              {
                analytics
                  .avgTimeline
              }
            </h1>
          </div>

        </div>

        {user?.role !==
          "artist" && (

          <>
           <h2
  style={{
    marginTop:
      "40px",
    color:
      "white"
  }}
>
  Artist
  Workload
</h2>

            {Object.entries(
              artistWorkload
            ).map(
              (
                [
                  artist,
                  count
                ]
              ) => (

                <div
                  key={
                    artist
                  }
                  style={{
                    ...card,
                    marginTop:
                      "15px"
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between"
                    }}
                  >

                    <strong>
                      {
                        artist
                      }
                    </strong>

                    <span>
                      {
                        count
                      }
                      {" "}
                      shots
                    </span>

                  </div>

                </div>
              )
            )}
          </>
        )}

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
    "20px",
  color:
    "white"
}

