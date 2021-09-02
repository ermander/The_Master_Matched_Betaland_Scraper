const fs = require("fs");

// Google
const { google } = require("googleapis");
const CLIENT_ID =
  "380825532247-ms7fb2sics98gidpja5mkolkoec9feor.apps.googleusercontent.com";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04QKJjcHQKpZZCgYIARAAGAQSNwF-L9IrDUrg8AhKs294_PKGmp-dgxlNJFdlTHPhiquI96hLlxOmfR3371ptoAznCOjlUOabUts";
const CLIENT_SECRET = "NCxvcASUE08q3XKS8ZLx62XA";

// Creating the authentication object
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

// Create an istance of google drive
const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

// Scraping Functions
const oneXTwoOddsScraper = require("./Scraping Functions/oneXTwoOddsScraper");
const homeScraper = require("./Scraping Functions/homeScraper");
const awayScraper = require("./Scraping Functions/awayScraper");
const sportNationTournamentScraper = require("./Scraping Functions/sportNationTournamentScraper");
const startDayScraper = require("./Scraping Functions/startDayScraper");
const startTimeScraper = require("./Scraping Functions/startTimeScraper");

const betalandScraper = async (
  chrome,
  Builder,
  By,
  Capabilities,
  links,
  sleep
) => {
  // Creating the chrome options
  const options = new chrome.Options();
  options.windowSize({ width: 1500, height: 850 });
  options.headless();
  // Initiating selenium web driver
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  // Opening Selenium
  await driver.manage().window();

  // Creating the array that will contain the infoes of all the GoldBet Soccer Matches
  let betalandOdds = [];

  for (let i = 0; i < links.length; i++) {
    await driver.get(links[i]);
    await sleep(500);
    console.log("Scraping:    ", await driver.getCurrentUrl());

    try {
      // Sport, Nation and Tournament
      const sportNationTournament = await sportNationTournamentScraper(
        driver,
        By,
        "div.nome-competizione-sport > span"
      );

      // Start Day
      const startDays = await startDayScraper(
        driver,
        By,
        "tabellaQuoteData pl-2"
      );

      // Start time
      let startTimes = await startTimeScraper(
        driver,
        By,
        "tabellaQuoteTempo__ora"
      );

      // Home
      const home = await homeScraper(
        driver,
        By,
        "font-weight-bold m-0 text-right"
      );
      // Away
      const away = await awayScraper(
        driver,
        By,
        "font-weight-bold m-0 text-left"
      );

      // All Odds (1X2, 1X 12 X2, U/O2.5, GG/NG)
      const oneXTwoOdds = await oneXTwoOddsScraper(
        driver,
        By,
        "tipoQuotazione_1"
      );

      // Inserting the start time and the start day
      let boxesDividedForDay = await driver.findElements(
        By.css("div#tabella-c")
      );
      let numberOfMatchPerDayArray = [];
      let temporaryOdds = [];
      for (let i = 0; i < boxesDividedForDay.length; i++) {
        numberOfMatchPerDay = await boxesDividedForDay[i].findElements(
          By.className("tabellaQuoteSquadre pointer")
        );
        numberOfMatchPerDayArray.push(numberOfMatchPerDay.length);
      }
      // Adding the start day
      for (let i = 0; i < boxesDividedForDay.length; i++) {
        for (let j = 0; j < numberOfMatchPerDayArray[i]; j++) {
          let match_info = {
            start_day: startDays[i],
            start_time: startTimes[i],
          };
          temporaryOdds.push(match_info);
        }
      }

      temporaryOdds = temporaryOdds.map((odd, i) => {
        return {
          ...odd,
          sport_type: sportNationTournament.sportType,
          nation: sportNationTournament.nation,
          tournament: sportNationTournament.tournament,
          home: home[i],
          away: away[i],
          one: oneXTwoOdds.oneOdds[i],
          x: oneXTwoOdds.xOdds[i],
          two: oneXTwoOdds.twoOdds[i],
          one_x: oneXTwoOdds.oneXOdds[i],
          one_two: oneXTwoOdds.oneTwoOdds[i],
          x_two: oneXTwoOdds.xTwoOdds[i],
          under_2_5: oneXTwoOdds.underOdds[i],
          over_2_5: oneXTwoOdds.overOdds[i],
          goal: oneXTwoOdds.goalOdds[i],
          no_goal: oneXTwoOdds.noGoalOdds[i],
        };
      });
      betalandOdds = [...betalandOdds, ...temporaryOdds];
    } catch (error) {
      console.log(error);
    }
  }
  // Uploading the odds to google drive
  const betalandOddsFile = JSON.stringify(betalandOdds)
  try {
    await drive.files.update({
      fileId: "1rJIlZo_3z45QwP_XR-jV5xdHUEFIC9fF",
      media: {
        mimeType: "application/json",
        body: betalandOddsFile,
      },
    });
  } catch (error) {
    console.log(error);
  }

  driver.close();
  return betalandOdds;
};

module.exports = betalandScraper;
