import React, { useEffect, useRef } from "react";
import styles from "./BgRemove.module.scss";

import bgImg from "../../../assets/images/bgRemove.png";
import { GlobalContext } from "../../../context/GlobalState";

const BgRemove = () => {
  const [image, setImage] = React.useState(null);
  const [downloadLink, setDownloadLink] = React.useState(false);
  const { disableNavbar } = React.useContext(GlobalContext);
  const file = useRef(null);

  useEffect(() => {
    disableNavbar(true);
  }, []);

  let imgURL =
    "https://media.istockphoto.com/photos/mature-woman-with-beach-hat-and-sunglasses-picture-id1137373616?k=20&m=1137373616&s=612x612&w=0&h=zYyuzYZ93h_PQVCQAc0-ePUYWZ8BNZObsnNrwf3mRNQ=";

  const uploadImage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let reader = new FileReader();
    reader.onload = (e) => {
      imgURL = e.target.result;
      setImage(imgURL);

      // eslint-disable-next-line no-undef
      fetch(`${process.env.REACT_APP_BACKEND_URL}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imgURL,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res.message);
          let base64image = btoa(
            new Uint8Array(res.image.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              "",
            ),
          );
          setImage(`data:image/png;base64,${base64image}`);
          setDownloadLink(true);
        })
        .catch((err) => console.log(err));
    };
    reader.readAsDataURL(e.target.files[0]);
    e.target.value = "";
  };

  const dropHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let reader = new FileReader();
    reader.onload = (e) => {
      imgURL = e.target.result;
      setImage(imgURL);

      // eslint-disable-next-line no-undef
      fetch(`${process.env.REACT_APP_BACKEND_URL}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imgURL,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res.message);
          let base64image = btoa(
            new Uint8Array(res.image.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              "",
            ),
          );
          setImage(`data:image/png;base64,${base64image}`);
          setDownloadLink(true);
        })
        .catch((err) => console.log(err));
    };
    reader.readAsDataURL(e.dataTransfer.files[0]);
    e.dataTransfer.clearData();
  };

  const dragHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginLeft}>
        <div className={styles.leftContainer}>
          <div className={styles.header}>Remove image background</div>
          <div className={styles.text}>100% automatic and free</div>
          <div className={styles.imgContainer}>
            <img src={imgURL} alt="image" />
          </div>
        </div>
      </div>
      <div
        className={styles.loginRight}
        onDragEnter={(e) => dragHandler(e)}
        onDragOver={(e) => dragHandler(e)}
        onDrop={(e) => {
          dragHandler(e), dropHandler(e);
        }}
      >
        <div className={styles.form}>
          {image ? (
            <img
              src={image}
              style={{ marginBottom: "2.5rem", width: "100%" }}
            />
          ) : (
            <>
              <img src={bgImg} style={{ marginBottom: "2.5rem" }} />
              <span className={styles.textTop}>
                File should be png, jpg and
                <br />
                less than 5mb
              </span>
            </>
          )}
          <br />
          <input
            ref={file}
            type="file"
            name="file"
            accept="image/png"
            onChange={(e) => uploadImage(e)}
            hidden
          />
          {downloadLink ? (
            <a
              href={image}
              download
              className={styles.downloadLink}
              onClick={() => {
                setDownloadLink(false);
                setImage(null);
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Image
            </a>
          ) : (
            <>
              <button
                className={styles.formButton}
                onClick={() => file.current.click()}
              >
                Upload Image →
              </button>
              <br />
              <span className={styles.drop}>Or drop a file</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BgRemove;
