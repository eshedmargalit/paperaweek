const expect = require("chai").expect;
const testDOIString = require("../testData").testDOIString;
const parseDoiString = require("../../services/doi").parseDoiString;

describe(".parseDoiString", () => {
  describe("when input is a real DOI string", () => {
    it("parses correctly", () => {
      expect(parseDoiString(testDOIString).journal).to.equal(
        "The Journal of Neuroscience"
      );
    });
  });

  describe("when input is falsey", () => {
    it("returns null", () => {
      expect(parseDoiString(null)).to.equal(null);
      expect(parseDoiString(undefined)).to.equal(null);
      expect(parseDoiString("")).to.equal(null);
    });
  });
});
