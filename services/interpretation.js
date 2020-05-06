const _ = require("lodash");

module.exports = {
  processEntities: function processEntities(entities) {
    return entities.map(entity => {
      // sort authors by position (first author first, etc)
      let authors = _.sortBy(entity.AA, [
        function(o) {
          return o.S;
        }
      ]);

      // filter down to unique authors and remove empty entries
      let author_names = _.uniq(
        authors.map(author => {
          return capitalCase(author.DAuN.split(".").join(""));
        })
      ).filter(name => name !== "");

      // filter down to unique institutions and remove empty entries
      let institutions = _.uniq(
        authors.map(author => {
          return capitalCase(author.DAfN)
            .split(".")
            .join("")
            .trim();
        })
      ).filter(name => name !== "");

      if (author_names === undefined || author_names.length === 0) {
        author_names = [""];
      }

      if (institutions === undefined || institutions.length === 0) {
        institutions = [""];
      }

      let entity_url = "";
      if (entity.S && entity.S.length !== 0) {
        entity_url = entity.S[0].U;
      }

      let journal_name = entity.VFN ? entity.VFN : "";

      const paper = {
        title: entity.DN,
        authors: author_names,
        institutions: institutions,
        date: new Date(entity.D),
        doi: entity.DOI,
        journal: journal_name,
        url: entity_url
      };
      return { paper: paper, id: entity.Id };
    });
  }
};

const capitalCase = input_str => {
  if (!input_str) {
    return "";
  }
  input_str = input_str.toLowerCase();
  const words = input_str.trim().split(" ");

  var new_str = "";
  for (let i = 0; i < words.length; i++) {
    var word = words[i];
    if (
      word === "and" ||
      word === "or" ||
      word === "in" ||
      word === "of" ||
      word === "the" ||
      word === "an" ||
      word === "at"
    ) {
      new_str += " " + word;
    } else {
      new_str += " " + word[0].toUpperCase() + word.substr(1).toLowerCase();
    }
  }

  return new_str;
};
