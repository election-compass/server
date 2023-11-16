const Bills = require('../models/bill');

exports.getBills = async (req, res) => {
    const { knessetNum  } = req.query;
    const filter = knessetNum? {knesset_num: knessetNum} : {}; //filter by knesset num if given
    try {
        const bills = await Bills.findAll({where: filter});
      return res.status(200).json(bills);
    } catch (error) {
      return res.status(404).json(error.message);
    }
  }
