import React, { useState, useEffect } from "react";
import propTypes from "prop-types";
import { Link, Navigate } from "react-router-dom";

import { GlobalContext } from "../../context/GlobalState";
import Card from "../../components/Card/Card";
import styles from "./Dashboard.module.scss";

const images = [
  "https://media.istockphoto.com/photos/mature-woman-with-beach-hat-and-sunglasses-picture-id1137373616?k=20&m=1137373616&s=612x612&w=0&h=zYyuzYZ93h_PQVCQAc0-ePUYWZ8BNZObsnNrwf3mRNQ=",
  "https://www.opus.software/wp-content/uploads/2020/09/Api-Gateway.jpg",
  "https://media.sproutsocial.com/uploads/2015/04/What-is-an-API.png",
  "https://www.gorges.us/images/google-fonts.png",
];

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const Ad = ({ image, title, desc }) => {
  return (
    <div className={styles.ad}>
      <img className={styles.adImg} src={image} alt="ad" />
      <div className={styles.adContainer}>
        <div className={styles.adDesign}> </div>
        <div className={styles.adText}>
          <span className={styles.adTitle}>{title}</span>
          <span className={styles.adDesc}>{desc}</span>
        </div>
        <div className={styles.buttonContainer}>
          <Link to="/app/bg-remove">
            <button className={styles.button}>View App</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

Ad.propTypes = {
  image: propTypes.string,
  title: propTypes.string,
  desc: propTypes.string,
};

const Dashboard = ({ ad, msg }) => {
  const { enableNavbar, loggedIn } = React.useContext(GlobalContext);
  const [allData, setAllData] = useState([]);

  function dummies(num) {
    let list = [];
    for (let i = 0; i < num; i++) {
      const object = {
        key: makeid(24),
        image: images[i % images.length],
        title: "API Name",
        brief:
          "The description of the API in quick brief and we will truncate it here...",
      };
      list.push(object);
    }

    const token = localStorage.getItem("token");

    if (token) {
      // eslint-disable-next-line no-undef
      fetch(`${process.env.REACT_APP_BACKEND_URL}/apis`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json().then((data) => {
              data = data.apis;
              for (let i = 0; i < data.length; i++) {
                const object = {
                  key: data[i]._id,
                  image: data[i].url,
                  title: data[i].name,
                  brief: data[i].description.substring(0, 100) + "...",
                };
                list.push(object);
              }
              setAllData(list);
            });
          }
        })
        .catch((err) => console.log(err));
    } else {
      setAllData(list);
    }
  }

  useEffect(() => {
    enableNavbar(true);
    dummies(8);
  }, []);

  return (
    <>
      {!loggedIn && !ad && <Navigate to="/" />}
      <div className={styles.home}>
        {ad && (
          <Ad
            image={images[0]}
            title="Background Image Remove"
            desc="100% automatic and free"
          />
        )}
        <span className={styles.title}>
          {msg == 0 ? "All APIs" : "Your uploaded APIs"}
        </span>
        <div className={styles.container}>
          {allData &&
            allData.map((e) => (
              <Card
                key={e.key}
                image={e.image}
                title={e.title}
                brief={e.brief}
              />
            ))}
        </div>
      </div>
    </>
  );
};

Dashboard.propTypes = {
  ad: propTypes.bool,
  msg: propTypes.number,
  demo: propTypes.number,
};

export default Dashboard;
