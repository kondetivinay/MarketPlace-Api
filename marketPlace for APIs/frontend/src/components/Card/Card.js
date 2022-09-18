import React from "react";
import PropTypes from "prop-types";

import styles from "./Card.module.scss";

const Card = ({ image, title, brief }) => {
  return (
    <div className={styles.card}>
      <img src={image} className={styles.cardImgTop} alt="API" />
      <span className={styles.cardTitle}>{title}</span>
      <div className={styles.cardBody}>
        <p className={styles.cardText}>{brief}</p>
      </div>
    </div>
  );
};

Card.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  brief: PropTypes.string,
};

export default Card;
