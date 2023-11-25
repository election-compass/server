const db = require('../util/database');
const localUtils = require('../util/localUtils');

exports.getBills = async (req, res) => {
  const { knessetNum } = req.query;
  const filter = knessetNum ? ` WHERE knessetNum = ${db.escape(knessetNum)}` : '';

  try {
    const query = `SELECT * FROM bills`;
    
    const [bills] = await db.query(query + filter);
    return res.status(200).json(bills);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.postUserVotes = async (req, res) => {
  const body = req.body;
  const selectedBills = Object.keys(body);
  const data = new Map();

  try {
    for (const bill of selectedBills) {
      // Fetch all voters associated with the current bill
      const votesQuery = `SELECT billId, mkId, mkVote FROM votes WHERE billId = ${db.escape(bill)}`;
      const votes = await db.query(votesQuery);

      // Map all votes to their voter
      for (const vote of votes) {
        const { billId, mkId, mkVote } = vote;
        const mkVoteInt = localUtils.voteStringToInt(mkVote);

        const billQuery = `SELECT name FROM bills WHERE id = ${db.escape(billId)}`;
        const bills = await db.query(billQuery);
        const { name } = bills[0];

        if (data.has(mkId)) {
          data.get(mkId).push({ billId, mkVote: mkVoteInt, billName: name });
        } else {
          data.set(mkId, [{ billId, mkVote: mkVoteInt, billName: name }]);
        }
      }
    }

    const scores = localUtils.findScoresToMembers(Object.entries(body), data, selectedBills.length);

    // Update data with score and mk name
    try {
      for (const [mkId, mkScore] of scores) {
        const existingData = data.get(mkId);
        data.delete(mkId);

        const mkNameQuery = `SELECT mkName FROM votes WHERE mkId = ${db.escape(mkId)}`;
        const mkNameResult = await db.query(mkNameQuery);
        const mkName = mkNameResult[0].mkName;

        data.set(mkName, { votes: existingData, score: mkScore });
      }
    } catch (error) {
      console.error(error);
    }

    return res.status(200).json(Array.from(data));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
