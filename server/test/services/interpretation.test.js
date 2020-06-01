const expect = require("chai").expect;
const capitalCase = require("../../services/interpretation").capitalCase;

describe(".capitalCase", () => {
  describe("when input is falsey", () => {
    it("returns an empty string", () => {
      expect(capitalCase("")).to.equal("");
      expect(capitalCase(null)).to.equal("");
      expect(capitalCase(undefined)).to.equal("");
      expect(capitalCase("  ")).to.equal("");
    });
  });

  describe("when string a single world", () => {
    it("capital cases correctly", () => {
      const scenarios = ["POTATO", "PoTaTo", "potato", "   potato"];

      scenarios.forEach(word => {
        expect(capitalCase(word)).to.equal(" Potato");
      });
    });
  });

  describe("when string has multiple words", () => {
    it("capital cases correctly", () => {
      expect(capitalCase("i am a nice man")).to.equal(" I Am A Nice Man");
      expect(capitalCase("I AM A NICE MAN")).to.equal(" I Am A Nice Man");
      expect(capitalCase("ROBERt and Jim")).to.equal(" Robert and Jim");
      expect(capitalCase("Do not go of the at or in the and")).to.equal(
        " Do Not Go of the at or in the and"
      );
    });
  });
});
