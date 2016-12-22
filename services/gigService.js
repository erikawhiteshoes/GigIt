const Datastore = require('nedb');
const path = require('path');

const gigsDb = new Datastore({ filename: path.join(__dirname, 'gigs.db')});
const venuesDb = new Datastore({ filename: path.join(__dirname, 'venues.db')});

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

gigsDb.loadDatabase(onLoadDb('gigs'));
venuesDb.loadDatabase(onLoadDb('venues'));

function allGigs(cb){
  gigsDb.find({}, (err, gigs) =>
  {
    cb(err, gigs)
  })
}

function allGigsWithVenues(cb) {
  gigsWithVenues({}, cb)
}

function gigsWithVenues(q, cb) {
  gigsDb.find(q, (err, gigs) => {
    if (err){
      cb(err)
    } else {
      hydrateGigs(gigs, cb)
    }
  })
}

function hydrateGigs(gigs, cb) {
  let venIds = gigs.map(g => g.venue_id)
  venuesDb.find({_id: {$in:venIds}}, (err, venues) => {
    let venHash = venues.reduce((acc, val) => {
      acc[val._id] = val
      return acc
    }, {})
    let hydratedGigs = gigs.map(g =>
      Object.assign({}, g, {venue: venHash[g.venue_id]}))
    cb(null, hydratedGigs)
  })
}

function findGigById(id, cb) {
  gigsDb.findOne({_id: id}, cb)
}

function updateGig(id, gig, cb) {
  gigsDb.update({_id: id}, gig, {}, (err, numAffected, affectedDocuments) => {
    if(err) {console.error(err)}
    cb(err, affectedDocuments)
  })
}

function removeById(id, cb) {
  gigsDb.remove({_id: id}, (err, gig) => {
    if(err) {console.error(err)}
    cb(err, gig)
  })
}

function newGig(obj, cb){ // cb: function(err, insertedGig)
  //todo: add validation
  let gig = {name: obj.name,paid: obj.paid,fee: obj.fee,venue_id: obj.venue_id }

  // example validation
  if(!gig.name) {
    cb("name not set, stupid")
    return
  }
  gigsDb.insert(gig, cb)
}

function allVenues(cb){
  venuesDb.find({}, (err, venues) =>
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
  venuesDb.insert(venue, cb)
}

function newGAndV(gobj, vobj, cb){ // cb: function(err, insertedVenue)
  //todo: add validation
  let v = {name: vobj.name, street1: vobj.street1, street2: vobj.street2, city: vobj.city, state: vobj.state, zip: vobj.zip }
  let g = {name: gobj.name,paid: gobj.paid,fee: gobj.fee }

  venuesDb.insert(v, function(err, venue) {
    gigsDb.insert(g, function(err, gig){
      cb(null, {gig:gig, venue:venue})
    })
  })
}
module.exports = {
  allGigs, newGig, allVenues, newVenue, newGAndV, findGigById, removeById, hydrateGigs, allGigsWithVenues, updateGig
};
