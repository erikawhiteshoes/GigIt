const Datastore = require('nedb');
const path = require('path');

// renamed db to gigs
const gigs = new Datastore({ filename: path.join(__dirname, 'gigs.db')});
const venues = new Datastore({ filename: path.join(__dirname, 'venues.db')});

// this is a higher order function. Given a name as a string
// it returns a call back for logging success/failure of loading a collection
// we will have a few collections and only want to write this code once.
function onLoadDb(name){
  return function(err){
    if(err){
      console.error(err)
      console.log('abandoning process, db load errors')
      process.exit(1) // 1 is non-zero, indicating failure
    } else {
      console.log(`successfully loaded ${name} collection`);
    }
  }
}

gigs.loadDatabase(onLoadDb('gigs'));
venues.loadDatabase(onLoadDb('venues'));

function allGigs(cb){
  gigs.find({}, (err, gigs) =>
  {
    console.dir({err, gigs})
    cb(err, gigs)
  })
}

module.exports = {
  allGigs
};
