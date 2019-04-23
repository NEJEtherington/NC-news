const { expect } = require("chai");
const { formatDataForTimeStamp } = require("../utils/seed-functions");

describe("formatDataForTimeStamp", () => {
  it("changes created_at timestamp to date format when passed an array of length 1", () => {
    const input = [{ created_at: 1471522072389 }];
    const actual = formatDataForTimeStamp(input);
    expect(actual[0]).to.be.an("object");
    expect(actual[0]["created_at"].toString()).to.equal(
      "Thu Aug 18 2016 13:07:52 GMT+0100 (British Summer Time)"
    );
  });
  it("does not mutate objects within original passed array", () => {
    const input = [{ created_at: 1471522072389 }];
    const actual = formatDataForTimeStamp(input);
    expect(actual[0]["created_at"]).to.not.eql(input[0]["created_at"]);
  });
  it("changes all created_at timestamps to date format when passed an array of length 1", () => {
    const input = [
      { created_at: 1471522072389 },
      { created_at: 1471522072389 }
    ];
    const actual = formatDataForTimeStamp(input);
    expect(actual[0]).to.be.an("object");
    expect(actual[0]["created_at"].toString()).to.equal(
      "Thu Aug 18 2016 13:07:52 GMT+0100 (British Summer Time)"
    );
    expect(actual[1]).to.be.an("object");
    expect(actual[1]["created_at"].toString()).to.equal(
      "Thu Aug 18 2016 13:07:52 GMT+0100 (British Summer Time)"
    );
  });
});
