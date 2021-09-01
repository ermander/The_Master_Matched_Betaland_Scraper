const fs = require("fs");

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
  // Setting the strategies of the page load
  const caps = new Capabilities();
  caps.setPageLoadStrategy("normal");
  // Initiating selenium web driver
  let driver = await new Builder()
    .withCapabilities(caps)
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  // Opening Selenium
  await driver.manage().window();

  // Creating the array that will contain the infoes of all the GoldBet Soccer Matches
  let betalandOdds = [];

  // Looping throw all the links in order to open all of them
  for (let i = 0; i < links.length; i++) {
    // Opening a new windows tab
    await driver.switchTo().newWindow("tab");
    // Navigate to Url
    await driver.get(links[i]);
  }

  // Getting the id of all the tabs opened
  const allWindows = await driver.getAllWindowHandles();
  for (let i = 1; i < allWindows.length; i++) {
    await driver.switchTo().window(allWindows[i]);
    await sleep(100);
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
      return error;
    }

    driver.close();
  }
  let betalandOddsFile = JSON.stringify(betalandOdds);
  fs.writeFileSync("betalandOdds.json", betalandOddsFile);
  driver.quit();
  return betalandOdds;
};

module.exports = betalandScraper;
