import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { GlobalContext } from "../../context/GlobalState";
import styles from "./Login.module.scss";
import profile from "../../assets/images/stroke.png";

const Login = () => {
  const { disableNavbar, login, loggedIn } = useContext(GlobalContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wrong, setWrong] = useState(true);

  useEffect(() => {
    disableNavbar();
  }, []);

  function submitHandler(e) {
    e.preventDefault();

    var requestOptions = {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    };

    // eslint-disable-next-line no-undef
    fetch(`${process.env.REACT_APP_BACKEND_URL}/auth`, requestOptions)
      .then((res) => {
        if (res.status == 200) {
          res.json().then((data) => {
            localStorage.setItem("token", data.token);
          });

          login();
        } else if (res.status == 401) {
          console.log(requestOptions);
          // eslint-disable-next-line no-undef
          fetch(`${process.env.REACT_APP_BACKEND_URL}/signup`, requestOptions)
            .then((res) => {
              if (res.status == 200) {
                res.json().then((data) => {
                  localStorage.setItem("token", data.token);
                });
                login();
              }
            })
            .catch((err) => console.log(err));
        } else setWrong(false);
      })
      .catch((error) => console.log("error", error));
  }

  return (
    <>
      {loggedIn && <Navigate to="/" />}
      <div className={styles.container}>
        <div className={styles.loginLeft}>
          <div className={styles.leftContainer}>
            <div className={styles.imgContainer}>
              <img src={profile} />
            </div>
            <div className={styles.header}>Welcome to your Dashboard</div>
            <div className={styles.text}>
              Your uploaded APIs will be
              <br />
              displayed here once you login to your
              <br />
              account
            </div>
          </div>
        </div>
        <div className={styles.loginRight}>
          <form className={styles.form} onSubmit={(e) => submitHandler(e)}>
            <div className={styles.formHeader}>Login to your account</div>
            <input
              className={styles.formInput}
              type="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
              className={styles.formInput}
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <input
              className={styles.formButton}
              type="submit"
              value="Login / Signup"
            />
            <br />
            <span hidden={wrong} className={styles.error}>
              Wrong Password or username
            </span>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
