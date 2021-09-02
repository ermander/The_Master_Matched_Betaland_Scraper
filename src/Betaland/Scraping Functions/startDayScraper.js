const months = require("../Months/months");

const startDayScraper = async (driver, By, selector) => {
  try {
    let startDays = await driver.findElements(By.className(selector));
    for (let i = 0; i < startDays.length; i++) {
      startDays[i] = await startDays[i].getText();
      let day = startDays[i].split(" ")[1];
      let month = startDays[i].split(" ")[2];
      let year = startDays[i].split(" ")[3];
      startDays[i] = `${day}/${months[month]}/${year}`;
    }
    return startDays;
  } catch {
    console.log(error);
  }
};

module.exports = startDayScraper;
