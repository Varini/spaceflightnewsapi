/* eslint-disable radix,camelcase,no-param-reassign */
const mannedFlights = require('../models/mannedFlights');

exports.mannedFlightsEndpoint = (req, res) => {
  const reqLimit = parseInt(req.query.limit);
  const reqPage = parseInt(req.query.page);
  delete req.query.limit;
  delete req.query.page;
  const query = Object.keys(req.query).reduce((mappedQuery, key) => {
    const param = req.query[key];
    if (param) {
      mappedQuery[key] = param;
    }
    return mappedQuery;
  }, {});

  // Making sure we don't continue if we get page 0.
  if (reqPage < 0 || reqPage === 0) {
    res.json({ Error: 'Requested page can not be 0' });
  } else {
    mannedFlights.find(query)
      .limit(reqLimit)
      .skip(reqLimit * (reqPage - 1))
      .select('-status')
      .then((expedition) => {
        if (expedition === undefined || expedition.length === 0) {
          res.status(404).json({ Error: 'Nothing found! Please refine your search. No worries, it happens to all of us sometimes.' });
        } else {
          res.send(expedition);
        }
      });
  }
};

exports.issStatus = (req, res) => {
  // First we define the object to be send
  const iss = {
    name_long: 'International Space Station',
    name_short: 'ISS',
    astronauts: [],
  };

  // Lets find all the ISS Expeditions, push them to the ISS object and send it
  mannedFlights.find({
    destination: 'iss',
    flight_status: 'docked',
  })
    .then((issMannedFlihts) => {
      issMannedFlihts.forEach((foundFlight) => {
        foundFlight.astronauts.forEach((astronaut) => {
          iss.astronauts.push(astronaut);
        });
      });
    })
    .then(() => { res.json(iss); });
};
