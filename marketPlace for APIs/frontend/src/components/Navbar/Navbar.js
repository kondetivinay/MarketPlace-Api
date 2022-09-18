import React, { useState, useContext, useEffect } from "react";
import propTypes from "prop-types";
import { NavLink } from "react-router-dom";

import { GlobalContext } from "../../context/GlobalState";
import styles from "./Navbar.module.scss";
import logo from "../../assets/images/logo.svg";

import Button from "../Button/Button";

const Navbar = ({ flipModal }) => {
  const [navLinks, setNavLinks] = useState([]);
  const { navbar, loggedIn } = useContext(GlobalContext);

  useEffect(() => {
    if (loggedIn) {
      setNavLinks([
        { name: "My APIs", path: "/myapi" },
        { name: "My Account", path: "/myaccount" },
      ]);
    } else {
      setNavLinks([]);
    }
    console.log("loggedIn", loggedIn);
    console.log("navLinks", navLinks);
  }, [loggedIn]);

  return (
    <nav className={styles.container}>
      <NavLink to="/">
        <img src={logo} alt="logo" />
      </NavLink>
      <div hidden={navbar}>
        {navLinks.map((e, i) => (
          <NavLink key={i} className={styles.lnText} to={e.path}>
            {e.name}
          </NavLink>
        ))}
        {loggedIn ? (
          <Button text="+ New API" onClick={flipModal} />
        ) : (
          <Button
            text="Login/Signup"
            onClick={() => (location.href = "/login")}
          />
        )}
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  flipModal: propTypes.func,
};

export default Navbar;
