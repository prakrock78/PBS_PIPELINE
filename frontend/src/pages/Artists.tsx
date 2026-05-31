import { useEffect, useState } from "react"

type Artist = {
  id: number
  name: string
  department: string
  role: string
  availability: string
}

export default function Artists() {

  const [showForm,
    setShowForm] =
    useState(false)

  const [artistName,
    setArtistName] =
    useState("")

  const [department,
    setDepartment] =
    useState("Compositing")

  const [role,
    setRole] =
    useState("Artist")

  const [availability,
    setAvailability] =
    useState("Available")

  const [artists,
    setArtists] =
    useState<Artist[]>(
      () => {

        const saved =
          localStorage.getItem(
            "pbs_artists"
          )

        if (saved) {
          return JSON.parse(
            saved
          )
        }

        return [
          {
            id: 1,
            name:
              "Kapil",
            department:
              "Compositing",
            role:
              "Senior Artist",
            availability:
              "Available"
          }
        ]
      }
    )

  useEffect(() => {

    localStorage.setItem(
      "pbs_artists",
      JSON.stringify(
        artists
      )
    )

  }, [artists])

  const addArtist =
    () => {

      if (
        !artistName
      ) {

        alert(
          "Enter artist name"
        )

        return
      }

      const newArtist = {

        id:
          Date.now(),

        name:
          artistName,

        department,

        role,

        availability
      }

      setArtists(
        (
          prev
        ) => [
          ...prev,
          newArtist
        ]
      )

      setArtistName("")
      setDepartment(
        "Compositing"
      )
      setRole(
        "Artist"
      )
      setAvailability(
        "Available"
      )

      setShowForm(
        false
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
            Artists
          </h1>

          <p
            style={{
              color:
                "#888"
            }}
          >
            Manage Artists
          </p>

        </div>

        <button
          onClick={() =>
            setShowForm(
              true
            )
          }
          style={addBtn}
        >
          + Add Artist
        </button>

      </div>

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

        {artists.map(
          (
            artist
          ) => (

            <div
              key={
                artist.id
              }
              style={card}
            >

              <h2>
                {
                  artist.name
                }
              </h2>

              <p>
                Department:
                {" "}
                {
                  artist.department
                }
              </p>

              <p>
                Role:
                {" "}
                {
                  artist.role
                }
              </p>

              <span
                style={
                  statusStyle
                }
              >
                {
                  artist.availability
                }
              </span>

            </div>
          )
        )}

      </div>

      {showForm && (

        <div
          style={overlay}
        >

          <div
            style={popup}
          >

            <h2>
              Add Artist
            </h2>

            <input
              placeholder=
              "Artist Name"
              value={
                artistName
              }
              onChange={
                (e) =>
                  setArtistName(
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
                department
              }
              onChange={
                (e) =>
                  setDepartment(
                    e.target
                      .value
                  )
              }
              style={
                inputStyle
              }
            >
              <option>
                Compositing
              </option>

              <option>
                Roto
              </option>

              <option>
                Matchmove
              </option>

              <option>
                Animation
              </option>
            </select>

            <input
              placeholder=
              "Role"
              value={
                role
              }
              onChange={
                (e) =>
                  setRole(
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
                availability
              }
              onChange={
                (e) =>
                  setAvailability(
                    e.target
                      .value
                  )
              }
              style={
                inputStyle
              }
            >
              <option>
                Available
              </option>

              <option>
                Busy
              </option>

              <option>
                Leave
              </option>
            </select>

            <button
              onClick={
                addArtist
              }
              style={
                addBtn
              }
            >
              Save Artist
            </button>

          </div>

        </div>
      )}

    </div>
  )
}

const card = {
  background:
    "#171717",
  padding:
    "20px",
  borderRadius:
    "20px"
}

const statusStyle = {
  background:
    "#FF7A00",
  padding:
    "6px 12px",
  borderRadius:
    "10px"
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
    "400px",
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
