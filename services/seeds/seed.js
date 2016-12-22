const Datastore = require('nedb');
const path = require('path');

const gigsDb = new Datastore({ filename: path.join(__dirname, '../gigs.db')});
const venuesDb = new Datastore({ filename: path.join(__dirname, '../venues.db')});

function seed(seedFile, cb) { // cb: what to do after all things are seeded
  seedFile = seedFile || 'test-data.json'
  const seedData = require(path.join(__dirname, seedFile))

  function load(db, name){
    db.loadDatabase(function(err){
        if(err){
          console.error(err)
          console.log('abandoning process, db load errors')
          process.exit(1) // 1 is non-zero, indicating failure
        } else {
          console.log(`successfully loaded/created ${name} database`);
          db.remove({},{multi: true}, (err,num) => {
            db.insert(seedData[name], (err, docs) => {
              if(err) {
                console.error(err)
                console.log('abandoning process, db seeding errors')
                process.exit(1) // 1 is non-zero, indicating failure
              } else {
                console.log(`we think we seeded ${name} ok...`)
              }
             })
          })
        }
      })
  }

  load(venuesDb, 'venues')
  load(gigsDb, 'gigs')

  setTimeout(cb,3000) // HORRRIBLE HACK; FIX!!!!
}

module.exports = seed

// only if run from command line
if (require.main === module) {
  seed();
}
