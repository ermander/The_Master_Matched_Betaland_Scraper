const oneXTwoOddsScraper = async (driver, By, selector) => {
  try {
    let oneXTwoOdds = await driver.findElements(By.className(selector));
    for (let i = 0; i < oneXTwoOdds.length; i++) {
      oneXTwoOdds[i] = await oneXTwoOdds[i].getText();
      if (oneXTwoOdds[i] === "") {
        oneXTwoOdds[i] = "1";
      }
    }
    oneXTwoOdds.unshift("none");
    let oneOdds = [];
    let xOdds = [];
    let twoOdds = [];
    let oneXOdds = [];
    let oneTwoOdds = [];
    let xTwoOdds = [];
    let underOdds = [];
    let overOdds = [];
    let goalOdds = [];
    let noGoalOdds = [];

    for (let i = 0; i < oneXTwoOdds.length; i++) {
      if (i % 10 === 1) {
        oneOdds.push(oneXTwoOdds[i]);
      }
      if (i % 10 === 2) {
        xOdds.push(oneXTwoOdds[i]);
      }
      if (i % 10 === 3) {
        twoOdds.push(oneXTwoOdds[i]);
      }
      if (i % 10 === 4) {
        oneXOdds.push(oneXTwoOdds[i]);
      }
      if (i % 10 === 5) {
        oneTwoOdds.push(oneXTwoOdds[i]);
      }
      if (i % 10 === 6) {
        xTwoOdds.push(oneXTwoOdds[i]);
      }
      if (i % 10 === 7) {
        underOdds.push(oneXTwoOdds[i]);
      }
      if (i % 10 === 8) {
        overOdds.push(oneXTwoOdds[i]);
      }
      if (i % 10 === 9) {
        goalOdds.push(oneXTwoOdds[i]);
      }
      if (i % 10 === 0) {
        noGoalOdds.push(oneXTwoOdds[i]);
      }
    }
    noGoalOdds.shift();
    return {
      oneOdds,
      xOdds,
      twoOdds,
      oneXOdds,
      oneTwoOdds,
      xTwoOdds,
      underOdds,
      overOdds,
      goalOdds,
      noGoalOdds,
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = oneXTwoOddsScraper;
