const Bills = require('../models/Bill');
const Votes = require('../models/Vote');
const localUtils = require('../util/localUtils');

exports.getBills = async (req, res) => {
    const { knessetNum  } = req.query;
    const filter = knessetNum? {knesset_num: knessetNum} : {}; //filter by knesset num if given
    try {
        const bills = await Bills.findAll({where: filter, attributes: ['id', 'name']});
      return res.status(200).json(bills);
    } catch (error) {
      return res.status(404).json(error.message);
    }
  }

  exports.postUserVotes = async (req, res) => {
    const body = req.body;
    const selectedBills = Object.keys(body);
    let allVotes = [];

    try {
      for (const bill of selectedBills) {
        const votes = await Votes.findAll({
          where: { billId: bill },
          attributes: ['billId', 'mkId', 'mkVote'],
        });
  
        const voteValues = votes.map(vote => ({
          billId: vote.dataValues.billId,
          mkId: vote.dataValues.mkId,
          mkVote: localUtils.voteStringToInt(vote.dataValues.mkVote)
        }));
        
        allVotes.push(voteValues);
      }
      const scores = localUtils.findScoresToMembers(body, allVotes.flat(), selectedBills.length);
      return res.status(200).json(Object.fromEntries(scores));
    } catch (error) {
      console.log(error)
      return res.status(404).json(error.message);
    }
  };
  
