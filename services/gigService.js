const Datastore = require('nedb');
const path = require('path');
const db = new Datastore({ filename: path.join(__dirname, 'gigs.json')});

db.loadDatabase(function (err) {
});


function allGigs(cb){
  db.find({}, (err, gigs) =>
  {
    console.dir({err, gigs});

    cb(err, gigs)
  })
}

module.exports = {
  allGigs
};
