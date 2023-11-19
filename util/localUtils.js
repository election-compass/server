const PRO_STRING = "בעד";
const AGAINST_STRING = "נגד";
const NEUTRAL_STRING = "נמנע";
const PRO_INT = 1;
const AGAINST_INT = 2;
const NEUTRAL_VOTE = 3;
const NEUTRAL_SCORE = 0;
const MAX_GRADE = 100;

/**
 * Transforms hebrew text representing vote into an integer.
 */
exports.voteStringToInt = (vote) => {
  switch (vote) {
    case PRO_STRING:
      return PRO_INT;
    case AGAINST_STRING:
      return AGAINST_INT;
    case NEUTRAL_STRING:
      return NEUTRAL_VOTE;
    default:
        return NEUTRAL_VOTE;
  }
};

/**
 * Finds the score of each Knesset member in relation to what the user chose.
 * @param {Map} userVotes - mapping of IDs for bills and the corresponding votes cast by a user.
 * @param {Object} members_vote_object  dict of {key= bill id, value= list of {member id, vote}}. // vote (-1 0 1)
 * @returns {Map} score per member {key= member id, val= score}.
 */
exports.findScoresToMembers = (userVotes, members_vote_object, totalBills) => {
  const res = new Map();
  const relativePoint = MAX_GRADE / totalBills;

  members_vote_object.forEach((vote) => {
    let currentScore = res.get(vote.mkId) || NEUTRAL_SCORE;
    //if the user has voted on current bull
    if (userVotes[vote.billId] !== NEUTRAL_VOTE) {
      currentScore +=
        vote.mkVote === userVotes[vote.billId]
          ? relativePoint
          : NEUTRAL_SCORE;
    } else {
      currentScore += relativePoint;
    }
    res.set(vote.mkId, currentScore);
  });
  return res;
};
