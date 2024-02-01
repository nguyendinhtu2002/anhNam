const mongoose = require("mongoose");

const connectDatabase = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.MONGODB_URI, 
      //   {
      //   auth: {
      //     username: process.env.MONGODB_USERNAME,
      //     password: process.env.MONGODB_PASSWORD,
      //   },
      //   authMechanism: "DEFAULT",
      //   authSource: "admin",
      // }
      )
      .then((value) => {
        resolve(`Connecting to uri ${process.env.MONGODB_URI} is success!`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = connectDatabase;
