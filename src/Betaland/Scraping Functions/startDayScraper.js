const startDayScraper = async (driver, By, selector) => {
  try {
    let startDays = await driver.findElements(By.className(selector));
    for (let i = 0; i < startDays.length; i++) {
      startDays[i] = await startDays[i].getText();
    }
    return startDays;
  } catch {
    console.log(error);
  }
};

module.exports = startDayScraper;
