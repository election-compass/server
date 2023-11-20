const Bills = require("../models/Bill");
const Votes = require("../models/Vote");
const localUtils = require("../util/localUtils");

exports.getBills = async (req, res) => {
  const { knessetNum } = req.query;
  const filter = knessetNum ? { knesset_num: knessetNum } : {}; //filter by knesset num if given
  try {
    const bills = await Bills.findAll({
      where: filter,
      attributes: ["id", "name"],
    });
    return res.status(200).json(bills);
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

exports.postUserVotes = async (req, res) => {
  const body = req.body;
  const mappedUserVotes = new Map(Object.entries(body).map(([key, value]) => [parseInt(key, 10), value]));
  const selectedBills = Object.keys(body);
  const data = new Map();

  try {
    for (const bill of selectedBills) {
      // fetch all voters associated with current bill
      const votes = await Votes.findAll({
        where: { billId: bill },
        attributes: ["billId", "mkId", "mkVote"],
      });
      
      // map all votes to their voter
      votes.forEach((vote) => {
        const { billId, mkId, mkVote } = vote.dataValues;
        const mkVoteInt = localUtils.voteStringToInt(mkVote);
        
        if (data.has(mkId)) {
          data.get(mkId).push({ billId, mkVote: mkVoteInt });
          return;
        }
        data.set(mkId, [{ billId, mkVote: mkVoteInt }]);
      });
    }

    const scores = localUtils.findScoresToMembers(
      mappedUserVotes,
      data,
      selectedBills.length
    );
    
    //update data with score and km name
    try {
      for (const [mkId, mkScore] of scores) {
        const existingData = data.get(mkId);
        data.delete(mkId);

        const mkName = await Votes.findOne({
          where: { mkId },
          attributes: ["mkName"],
        });
        data.set(mkName.dataValues.mkName, {votes: existingData, score: mkScore})
      }
    } catch (error) {
      console.log(error);
    }

    return res.status(200).json(Array.from(data));
  } catch (error) {
    console.log(error);
    return res.status(404).json(error.message);
  }
};
