import {
  useState
} from "react"

import {
  useNavigate
} from "react-router-dom"

export default function Login() {

  const navigate =
    useNavigate()

  const [email,
    setEmail] =
    useState("")

  const [password,
    setPassword] =
    useState("")

  const [loading,
    setLoading] =
    useState(false)

  const handleLogin =
    async () => {

      try {

        setLoading(
          true
        )

        const response =
          await fetch(
            "http://127.0.0.1:8000/auth/login",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify({
                  email,
                  password
                })
            }
          )

        const data =
          await response.json()

        if (
          !response.ok
        ) {

          alert(
            data.detail ||
            "Login failed"
          )

          return
        }

        localStorage.setItem(
          "pbs_token",
          data.access_token
        )

        localStorage.setItem(
          "pbs_user",
          JSON.stringify({
            role:
              data.role,

            name:
              data.name,

            email
          })
        )

        if (
          data.role ===
          "artist"
        ) {

          navigate(
            "/artist-shots"
          )

          return
        }

        if (
        data.role ===
        "lead"
      ) {

        navigate(
          "/lead-qc"
       )

          return
        }

        if (
          data.role ===
          "client"
        ) {

          navigate(
            "/client-portal"
          )

          return
        }

        navigate(
          "/dashboard"
        )

      } catch {

        alert(
          "Server not running"
        )

      } finally {

        setLoading(
          false
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
        display:
          "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
        color:
          "white"
      }}
    >

      <div
        style={{
          width:
            "420px",
          background:
            "#171717",
          padding:
            "40px",
          borderRadius:
            "24px"
        }}
      >

        <h1
          style={{
            textAlign:
              "center"
          }}
        >
          PBS Login
        </h1>

        <input
          type="email"
          placeholder=
          "Email"
          value={
            email
          }
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          style={
            inputStyle
          }
        />

        <input
          type="password"
          placeholder=
          "Password"
          value={
            password
          }
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          style={
            inputStyle
          }
        />

        <button
          onClick={
            handleLogin
          }
          style={
            loginButton
          }
        >
          {
            loading
              ? "Logging in..."
              : "Login"
          }
        </button>

      </div>

    </div>
  )
}

const inputStyle = {
  width:
    "100%",
  padding:
    "14px",
  marginTop:
    "15px",
  borderRadius:
    "12px",
  border:
    "1px solid #333",
  background:
    "#252525",
  color:
    "white",
  boxSizing:
    "border-box" as const
}

const loginButton = {
  width:
    "100%",
  padding:
    "14px",
  marginTop:
    "20px",
  background:
    "#FF7A00",
  border:
    "none",
  color:
    "white",
  borderRadius:
    "12px",
  cursor:
    "pointer",
  fontWeight:
    "bold" as const
}