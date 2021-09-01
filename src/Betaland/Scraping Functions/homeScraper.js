const homeScraper = async (driver, By, selector) => {
  try {
    let home = await driver.findElements(By.className(selector));
    for (let i = 0; i < home.length; i++) {
      home[i] = await home[i].getText();
    }
    return home;
  } catch (error) {
    console.log(error);
  }
};

module.exports = homeScraper;
