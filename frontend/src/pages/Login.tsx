import { useState } from "react"
import axios from "axios"
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

  const handleLogin =
    async () => {

      try {

        const response =
          await axios.post(
            "http://127.0.0.1:8000/users/login",
            {},
            {
              params: {
                email,
                password
              }
            }
          )

        console.log(
          response.data
        )

        localStorage.setItem(
          "pbs_login",
          "true"
        )

        navigate(
          "/dashboard"
        )

      } catch {

        alert(
          "Invalid Login"
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
          "center"
      }}
    >

      <div
        style={{
          width:
            "400px",
          background:
            "#171717",
          padding:
            "30px",
          borderRadius:
            "20px"
        }}
      >

        <h1
          style={{
            color:
              "white"
          }}
        >
          Login
        </h1>

        <input
          placeholder=
          "Email"

          value={
            email
          }

          onChange={
            (e) =>
              setEmail(
                e.target
                  .value
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

          onChange={
            (e) =>
              setPassword(
                e.target
                  .value
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
          style={{
            width:
              "100%",
            padding:
              "12px",
            background:
              "#FF7A00",
            border:
              "none",
            color:
              "white",
            borderRadius:
              "10px",
            marginTop:
              "20px",
            cursor:
              "pointer"
          }}
        >
          Login
        </button>

      </div>

    </div>
  )
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