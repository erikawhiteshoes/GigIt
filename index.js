
const express = require ('express')
const app = express()
const gigService = require('./services/gigService.js')
const bodyParser = require('body-parser')

app.set('view engine', 'pug')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

//Prints request url
app.use((req,res,next) => {
  console.log(req.url)
  next();
});

//Allows objects to be inserted into gig and venue dbs with single submit
app.post('/web/gandv', (req, res) => {
  let body = req.body
  let g = body.gig
  let v = body.venue
  gigService.newGAndV(g, v, (err, obj) =>  {
    res.json(obj)
  })
})

//Populates venue menu for new-gig
app.get('/new-gig/', (req, res) => {
  gigService.allVenues((err, venues) => {
    if(err){console.error(err)}
    res.render('new-gig', {venues})
  })
})

app.post('/new-gig/', (req, res) => {
  let body = req.body;
  let g = body.gig;
  let v = body.venue;
  if(body.existing_venue) {
    g.venue_id = body.existing_venue
    gigService.newGig(g, (err, obj) => {
    })
  }
  else {
    gigService.newGAndV(g, v, (err, obj) =>  {
      res.json(obj)
    })
  }
})

//Displays all gigs
app.get('/web/api/gigs', (req,res) => {
  gigService.allGigs((err, gigs) => {
    //todo: use node style err cb
    if(err){console.error(err)}
    res.json(JSON.stringify(gigs))
  })
})

app.get('/web/gigs', (req,res) => {
  gigService.allGigsWithVenues((err, gigs) => {
    //todo: use node style err cb
    if(err){console.error(err)}
    res.render('gigs', {gigs})
  })
})

//Displays all venues
app.get('/api/venues', (req,res) => {
  gigService.allVenues((err, venues) => {
    //todo: use node style err cb
    if(err){console.error(err)}
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(venues))
  })
})

//Adds new venues
app.post('/api/venues/add', (req,res) => {
  let venue = req.body
  gigService.newVenue(venue, (err, addedVenue) => {
    if(err){
      console.error(err)
      res.status(501).send(err)
    }
    res.send(JSON.stringify(addedVenue))
  })
})

app.get('/web/api/gigs/view/:id', (req, res) => {
  gigService.findGigById(req.params.id, function(err, gig) {
    if (err) {
      console.error(err)
        res.status(500).send(err)
    }
    res.render('single-gig', {gig})
  })
})

//Update gigs by ID
app.put('/web/api/gigs/view/:id', (req, res) => {
  let gigId = req.params.id
  let updatedGig = req.body.data
  gigService.updateGig(gigId, updatedGig, (err, gig) => {
    if(err) {
      res.send(err)
    }
//    res.send(JSON.stringify(updatedGig))
  })
})

app.delete('/web/api/gigs/remove/:id', (req, res) => {
  gigService.removeById(req.params.id, function(err, gig) {
    if (err) {
      console.error(err)
        res.status(500).send(err)
    }
    res.redirect('/web/gigs')
  })
})

app.use(express.static('public'))

app.listen(3000, () => {
  console.log('listening on port 3000')
})
