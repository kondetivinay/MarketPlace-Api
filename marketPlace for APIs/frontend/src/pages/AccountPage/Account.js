import React, { useState, useEffect } from "react";
import propTypes from "prop-types";
import { Navigate } from "react-router-dom";

import { GlobalContext } from "../../context/GlobalState";
import Card from "../../components/Card/Card";
import styles from "./Account.module.scss";

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

const Account = ({ msg, demo }) => {
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
      // setAllData([...allData, object]);
    }

    const token = localStorage.getItem("token");

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
  }

  useEffect(() => {
    enableNavbar(true);
    dummies(demo);
  }, []);

  return (
    <>
      {!loggedIn && <Navigate to="/" />}
      <div className={styles.home}>
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

Account.propTypes = {
  ad: propTypes.bool,
  msg: propTypes.number,
  demo: propTypes.number,
};

export default Account;
