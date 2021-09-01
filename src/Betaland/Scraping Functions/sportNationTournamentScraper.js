const sportNationTournamentScraper = async (driver, By, selector) => {
  try {
    let sportNationTournament = await driver.findElements(By.css(selector));
    sportNationTournament = await sportNationTournament[0].getText();
    const sportType = sportNationTournament.split("-")[0].trim();
    const nation = sportNationTournament.split("- ")[1].trim();
    const tournament = sportNationTournament
      .split("- ")[2]
      .split("(")[0]
      .trim();
    return {
      sportType,
      nation,
      tournament,
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = sportNationTournamentScraper;
