import React from "react";
import propTypes from "prop-types";
import styles from "./Modal.module.scss";

const Modal = ({ handleClose, show }) => {
  const showHideClassName = show
    ? `${styles.modal} ${styles.displayBlock}`
    : `${styles.modal} ${styles.displayNone}`;

  const [apiName, setApiName] = React.useState("");
  const [apiUrl, setApiUrl] = React.useState("");
  const [apiDescription, setApiDescription] = React.useState("");

  const handleSubmit = () => {
    const token = localStorage.getItem("token");

    // eslint-disable-next-line no-undef
    fetch(`${process.env.REACT_APP_BACKEND_URL}/apis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        apiName: apiName,
        apiUrl: apiUrl,
        apiDescription: apiDescription,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            console.log(data);
          });
        }
      })
      .catch((err) => console.log(err));

    handleClose();
  };

  return (
    <div className={showHideClassName}>
      <section className={styles.form}>
        <h3 className={styles.header}>Add new API</h3>
        <input
          type="text"
          className={styles.inputSmall}
          placeholder="API Name"
          onChange={(e) => setApiName(e.target.value)}
        />
        <input
          type="text"
          className={styles.inputSmall}
          placeholder="API Endpoint"
          onChange={(e) => setApiUrl(e.target.value)}
        />
        <textarea
          type="text"
          rows="5"
          className={styles.inputLarge}
          placeholder="Description of API"
          onChange={(e) => setApiDescription(e.target.value)}
        />
        <button className={styles.button} type="button" onClick={handleSubmit}>
          Add API
        </button>
      </section>
    </div>
  );
};

Modal.propTypes = {
  handleClose: propTypes.func,
  show: propTypes.bool,
};

export default Modal;
