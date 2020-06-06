const moment = require("moment");
const parseDOIJSON = data => {
  // parse DOI string
  const parsedData = {};
  const targets = ["title", "journal", "DOI", "author", "year", "month", "url"];
  targets.forEach(target => {
    // (?<=startingPattern) matches startingPattern before the main expression, but
    //     doesn't include it in the final result
    // (?=closingPattern) matches closingPattern after the main expression, but
    //     doesn't include it in the final result
    // (.*?) matches the first pattern (lazy) that can have any number (*) of any
    //     character (.)
    let re = new RegExp(`(?<=${target}={)(.*?)(?=})`, "g");
    let matchingData = data.match(re)[0];
    parsedData[target] = matchingData;
  });

  // manipulate data into "paper" format
  const authors = parsedData.author.split(" and ");
  const authorsReordered = authors.map(author => {
    const parts = author.split(", ");
    return `${parts[1]} ${parts[0]}`;
  });
  const date = moment(
    `${parsedData.month}-${parsedData.year}`,
    "MMM YYYY"
  ).format();

  const paper = {
    title: parsedData.title,
    journal: parsedData.journal,
    url: parsedData.url,
    doi: parsedData.DOI,
    authors: authorsReordered,
    date,
    institutions: null // needs to be null instead of [] for front-end to render correctly
  };
  return { paper, id: parsedData.title };
};

module.exports = { parseDOIJSON };
