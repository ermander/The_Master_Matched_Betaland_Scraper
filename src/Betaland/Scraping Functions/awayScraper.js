const awayScraper = async (driver, By, selector) => {
  try {
    let away = await driver.findElements(By.className(selector));
    for (let i = 0; i < away.length; i++) {
      away[i] = await away[i].getText();
    }
    return away;
  } catch (error) {
    console.log(error);
  }
};

module.exports = awayScraper;
