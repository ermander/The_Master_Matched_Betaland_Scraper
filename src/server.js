// Selenium library
const { Builder, By, Capabilities } = require("selenium-webdriver");
// Chrome Web Driver
const chrome = require("selenium-webdriver/chrome");
// JSDOM library.
// This library is used in this program only for performance testing
// (The only purpose is to "console.log()" the time passed between one function and another)
const { JSDOM } = require("jsdom");
const { window } = new JSDOM();
// Betaland Scraper
const betalandScraper = require("./Betaland/betalandScraper");
// Importing all the links to scrape for each function
const betalandLinks = require("./Betaland/Links/betalandLinks");

const dotenv = require("dotenv");
// Dotenv configuration
dotenv.config();

/* 
  Some times the scraping functions needs some breaks between tasks
  Here we're creating a function that stops the code if needed.
  It takes a parameter (ms) that specifies the break time (in milliseconds)
*/
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mainScraper = async () => {
  // Scraping Betaland
  console.log("Starting to scrape Betaland odds.");
  let betalandOdds = [];
  while (true) {
    const betalandOddsResult = await betalandScraper(
      chrome,
      Builder,
      By,
      Capabilities,
      betalandLinks,
      sleep
    );
  }
};
mainScraper();
