const localUtils = require("../util/localUtils");

describe("Local Utils Tests - findScoresToMembers function ", () => {
  test("single mk - full alignment", async () => {
    const userVotesMock = new Map([
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 2],
    ]);
    const mkVotesMock = [
      { mkId: 1, billId: 1, mkVote: 1 },
      { mkId: 1, billId: 2, mkVote: 1 },
      { mkId: 1, billId: 3, mkVote: 1 },
      { mkId: 1, billId: 4, mkVote: 2 },
    ];
    const res = localUtils.findScoresToMembers(
      userVotesMock,
      mkVotesMock,
      userVotesMock.size
    );
    expect(res.get(1)).toBe(100);
  });

  test("single mk - full misalignment", async () => {
    const userVotesMock = new Map([
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 2],
    ]);
    const mkVotesMock = [
      { mkId: 1, billId: 1, mkVote: 2 },
      { mkId: 1, billId: 2, mkVote: 2 },
      { mkId: 1, billId: 3, mkVote: 2 },
      { mkId: 1, billId: 4, mkVote: 1 },
    ];
    const res = localUtils.findScoresToMembers(
      userVotesMock,
      mkVotesMock,
      userVotesMock.size
    );
    expect(res.get(1)).toBe(0);
  });

  test("single mk - user's votes neutral", async () => {
    const userVotesMock = new Map([
      [1, 3],
      [2, 3],
      [3, 3],
      [4, 3],
    ]);
    const mkVotesMock = [
      { mkId: 1, billId: 1, mkVote: 2 },
      { mkId: 1, billId: 2, mkVote: 2 },
      { mkId: 1, billId: 3, mkVote: 2 },
      { mkId: 1, billId: 4, mkVote: 1 },
    ];
    const res = localUtils.findScoresToMembers(
      userVotesMock,
      mkVotesMock,
      userVotesMock.size
    );
    expect(res.get(1)).toBe(100);
  });

  test("multiple mks", async () => {
    const userVotesMock = new Map([
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 1],
    ]);
    const mkVotesMock = [
      { mkId: 1, billId: 1, mkVote: 2 },
      { mkId: 1, billId: 2, mkVote: 2 },
      { mkId: 1, billId: 3, mkVote: 2 },
      { mkId: 1, billId: 4, mkVote: 1 },
      { mkId: 2, billId: 1, mkVote: 2 },
      { mkId: 2, billId: 2, mkVote: 2 },
      { mkId: 2, billId: 3, mkVote: 2 },
      { mkId: 2, billId: 4, mkVote: 1 },
      { mkId: 3, billId: 1, mkVote: 1 },
      { mkId: 3, billId: 2, mkVote: 2 },
      { mkId: 3, billId: 3, mkVote: 1 },
      { mkId: 3, billId: 4, mkVote: 1 },
    ];
    const res = localUtils.findScoresToMembers(
      userVotesMock,
      mkVotesMock,
      userVotesMock.size
    );
    expect(res.get(1)).toBe(75);
    expect(res.get(2)).toBe(75);
    expect(res.get(3)).toBe(100);
  });
});
