const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Api = require("./models/Api");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: ", err);
  });

app.post("/auth", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user)
      return res.status(401).json({
        message: "User does not exist",
      });
    else {
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Internal server error",
          });
        } else if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "10h",
            },
          );

          console.log(`Login attempt for ${user.email}`);

          return res.status(200).json({
            message: "User authenticated",
            token: token,
          });
        } else {
          return res.status(400).json({
            message: "Username/Password is incorrect",
          });
        }
      });
    }
  });
});

app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      const user = new User({
        email,
        password: hash,
      });

      user.save();

      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "10h",
        },
      );

      return res.status(200).json({
        message: "User created successfully",
        token: token,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).json({
        message: "Failed Signup",
      });
    });
});

app.post("/upload", (req, res) => {
  const { image } = req.body;
  const imageData = image.substring(image.indexOf(",") + 1);
  fs.writeFileSync("tmp.png", imageData, { encoding: "base64" });

  const inputPath = "tmp.png";
  const formData = new FormData();
  formData.append("size", "auto");
  formData.append(
    "image_file",
    fs.createReadStream(inputPath),
    path.basename(inputPath),
  );

  axios({
    method: "post",
    url: "https://api.remove.bg/v1.0/removebg",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      ...formData.getHeaders(),
      "X-Api-Key": `${process.env.REMOVE_BG_API_KEY}`,
    },
    encoding: "base64",
  })
    .then((response) => {
      if (response.status != 200)
        return console.error("Error:", response.status, response.statusText);

      console.log("Success:", response.status, response.statusText);
      return res.status(200).json({
        message: "Image uploaded successfully",
        image: response.data,
      });
      // fs.writeFileSync("../frontend/bg.png", response.data);
    })
    .catch((error) => {
      return console.error("Request failed:", error);
    });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.post("/apis", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { apiName, apiUrl, apiDescription } = req.body;

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    } else {
      const api = new Api({
        name: apiName,
        url: apiUrl,
        description: apiDescription,
        userId: decoded.userId,
      });

      api.save();

      return res.status(200).json({
        message: "API created successfully",
      });
    }
  });
});

app.get("/apis", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    } else {
      Api.find({ userId: decoded.userId })
        .then((apis) => {
          return res.status(200).json({
            message: "API list retrieved successfully",
            apis: apis,
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({
            message: "Internal server error",
          });
        });
    }
  });
});
