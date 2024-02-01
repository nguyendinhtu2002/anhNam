const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");
const app = express();
const cron = require("node-cron");
const Crawler = require("./models/Crawler");
const PORT = 6000;
const dotenv = require("dotenv");
dotenv.config();
const connectDatabase = require("./db.js");

async function getData() {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto(
    "https://windy.app/poi/13.9504742/108.6608142/An+Kh%C3%AA%2C+town"
  );

  // Set screen size
  await page.setViewport({ width: 1980, height: 1024 });

  const data = await page.evaluate(() => {
    const elements = document
      .querySelector("#percipCell")
      .querySelectorAll("text");

    if (elements.length > 0) {
      const firstFiveTexts = Array.from(elements)
        .slice(0, 8)
        .map((element) => element.textContent);

      const resultObject = {
        t01: firstFiveTexts[0] === "-" ? 0 : firstFiveTexts[0],
        t04: firstFiveTexts[1] === "-" ? 0 : firstFiveTexts[1],
        t07: firstFiveTexts[2] === "-" ? 0 : firstFiveTexts[2],
        t10: firstFiveTexts[3] === "-" ? 0 : firstFiveTexts[3],
        t13: firstFiveTexts[4] === "-" ? 0 : firstFiveTexts[4],
        t16: firstFiveTexts[5] === "-" ? 0 : firstFiveTexts[5],
        t19: firstFiveTexts[6] === "-" ? 0 : firstFiveTexts[6],
        t22: firstFiveTexts[7] === "-" ? 0 : firstFiveTexts[7],
      };

      return resultObject;
    } else {
      return { texts: [] };
    }
  });

  await browser.close();
  return data;
}

app.use(express.json());
app.use(cors());

app.get("/api/crawl", async (req, res) => {
  try {
    const yesterdayParam = req.query.y;
    let currentDate = new Date();
    const currentHours = currentDate.getHours();
    let startDate = new Date();
    startDate.setDate(
      startDate.getDate() - (yesterdayParam === "true" ? 1 : 0)
    );
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() - (yesterdayParam === "true" ? 1 : 0));
    endDate.setHours(23, 59, 59, 999);

    const dataNew = await Crawler.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    let newData;
    switch (currentHours) {
      case currentHours <= 4:
        newData = {
          message: "OK",
          data: {
            t: dataNew[0]?.t01,
            time: new Date(),
          },
        };
        break;
      case currentHours <= 7 && currentHours > 4:
        newData = {
          message: "OK",
          data: {
            t: dataNew[0]?.t04,
            time: new Date(),
          },
        };
        break;
      case currentHours <= 10 && currentHours > 7:
        newData = {
          message: "OK",
          data: {
            t: dataNew[0]?.t07,
            time: new Date(),
          },
        };
        break;
      case currentHours <= 13 && currentHours > 10:
        newData = {
          message: "OK",
          data: {
            t: dataNew[0]?.t10,
            time: new Date(),
          },
        };
        break;
      case currentHours <= 16 && currentHours > 13:
        newData = {
          message: "OK",
          data: {
            t: dataNew[0]?.t16,
            time: new Date(),
          },
        };
        break;
      case currentHours <= 19 && currentHours > 16:
        newData = {
          message: "OK",
          data: {
            t: dataNew[0]?.t19,
            time: new Date(),
          },
        };
        break;
      default:
        newData = {
          message: "OK",
          data: {
            t: dataNew[0]?.t22,
            time: new Date(),
          },
        };
        break;

    }

    res.json(newData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
cron.schedule("0 0 23 * * *", async () => {
  try {
    const data = await getData();

    const insertData = await Crawler.insertMany(data);

    console.log("Data inserted successfully:", insertData);
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
connectDatabase().then((res) => {
  console.log(res);
  app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
  });
});
