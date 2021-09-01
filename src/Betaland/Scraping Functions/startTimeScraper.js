const startTimeScraper = async (driver, By, selector) => {
  try {
    let startTimes = await driver.findElements(By.className(selector));
    for (let i = 0; i < startTimes.length; i++) {
      startTimes[i] = await startTimes[i].getText();
    }
    return startTimes;
  } catch {
    console.log(error);
  }
};

module.exports = startTimeScraper;
