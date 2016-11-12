const Datastore = require('nedb');
const path = require('path');

const gigs = new Datastore({ filename: path.join(__dirname, 'gigs.db')});
const venues = new Datastore({ filename: path.join(__dirname, 'venues.db')});

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

function findGigById(id, cb) {
  gigs.findOne({_id: id}, (err, gig) => {
    if(err) {console.error(err)}
    cb(err, gig)
  })
}

function removeById(id, cb) {
  gigs.remove({_id: id}, (err, gig) => {
    if(err) {console.error(err)}
    cb(err, gig)
  })
}

function newGig(obj, cb){ // cb: function(err, insertedGig)
  //todo: add validation
  let gig = {name: obj.name,paid: obj.paid,fee: obj.fee }

  // example validation
  if(!gig.name) {
    cb("name not set, stupid")
    return
  }
  gigs.insert(gig, cb)
}

function allVenues(cb){
  venues.find({}, (err, venues) =>
  {
    console.dir({err, venues})
    cb(err, venues)
  })
}

function newVenue(obj, cb){ // cb: function(err, insertedVenue)
  //todo: add validation
  let venue = {name: obj.name, street1: obj.street1, street2: obj.street2, city: obj.city, state: obj.state, zip: obj.zip }

  // example validation
  if(!venue.name) {
    cb("name not set, stupid")
    return
  }
  venues.insert(venue, cb)
}

function newGAndV(gobj, vobj, cb){ // cb: function(err, insertedVenue)
  //todo: add validation
  let v = {name: vobj.name, street1: vobj.street1, street2: vobj.street2, city: vobj.city, state: vobj.state, zip: vobj.zip }
  let g = {name: gobj.name,paid: gobj.paid,fee: gobj.fee }

  venues.insert(v, function(err, venue) {
    gigs.insert(g, function(err, gig){
      cb(null, {gig:gig, venue:venue})
    })
  })
}
module.exports = {
  allGigs, newGig, allVenues, newVenue, newGAndV, findGigById, removeById
};
