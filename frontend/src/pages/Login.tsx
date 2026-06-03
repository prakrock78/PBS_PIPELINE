import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {

  const navigate =
    useNavigate()

  const [email,
    setEmail] =
    useState("")

  const [password,
    setPassword] =
    useState("")

  const users = [

    {
      email:
        "admin@pbs.com",

      password:
        "1234",

      role:
        "admin",

      name:
        "Admin"
    },

    {
      email:
        "supervisor@pbs.com",

      password:
        "1234",

      role:
        "supervisor",

      name:
        "Supervisor"
    },

    {
      email:
        "artist@pbs.com",

      password:
        "1234",

      role:
        "artist",

      name:
        "Kapil"
    }
  ]

  const handleLogin =
    () => {

      const foundUser =
        users.find(
          (
            user
          ) =>
            user.email ===
              email &&
            user.password ===
              password
        )

      if (
        !foundUser
      ) {

        alert(
          "Invalid Credentials"
        )

        return
      }

      localStorage.setItem(
        "pbs_user",
        JSON.stringify(
          foundUser
        )
      )

      navigate(
        "/dashboard"
      )
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
            "24px",
          boxShadow:
            "0 0 30px rgba(0,0,0,0.3)"
        }}
      >

        <h1
          style={{
            textAlign:
              "center",
            marginBottom:
              "10px"
          }}
        >
          PBS Login
        </h1>

        <p
          style={{
            textAlign:
              "center",
            color:
              "#888",
            marginBottom:
              "30px"
          }}
        >
          Production
          Pipeline
          Login
        </p>

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
          Login
        </button>

        <div
          style={{
            marginTop:
              "25px",
            fontSize:
              "14px",
            color:
              "#999"
          }}
        >

          <p>
            Admin:
            admin@pbs.com
            / 1234
          </p>

          <p>
            Supervisor:
            supervisor@pbs.com
            / 1234
          </p>

          <p>
            Artist:
            artist@pbs.com
            / 1234
          </p>

        </div>

      </div>

    </div>
  )
}

const inputStyle = {
  width:
    "100%",
  padding:
    "14px",
  marginBottom:
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
  fontSize:
    "16px",
  fontWeight:
    "bold" as const
}
