
const express = require ('express');
const app = express();
const gigRouter = express.Router();
const gigService = require('./services/gigService.js');
const bodyParser = require('body-parser');

app.set('view engine', 'pug')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.json());

// //gigRouter.route('/')
//   .get(function(req,res) {
//     res.setHeader('Content-Type', 'application/json');
//     res.send(JSON.stringify(gigs));
//   });
//
// app.use('/api/gigs', gigRouter);

//Prints request url
app.use((req,res,next) => {
  console.log(req.url);
  next();
});

//Allows objects to be inserted into gig and venue dbs with single submit
app.post('/web/gandv', (req, res) => {
  let body = req.body;
  let g = body.gig;
  let v = body.venue;
  gigService.newGAndV(g, v, (err, obj) =>  {
    res.json(obj)
  })
})

//Displays all gigs
app.get('/api/gigs', (req,res) => {
  gigService.allGigs((err, gigs) => {
    //todo: use node style err cb
    if(err){console.error(err)}
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(gigs));
  })
});

app.get('/gigs', (req,res) => {
  gigService.allGigs((err, gigs) => {
    //todo: use node style err cb
    if(err){console.error(err)}
    res.render('gigs', {gigs});
  })
});

//Displays all venues
app.get('/api/venues', (req,res) => {
  gigService.allVenues((err, venues) => {
    //todo: use node style err cb
    if(err){console.error(err)}
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(venues));
  })
});

//Adds new venues
app.post('/api/venues/add', (req,res) => {
  console.dir(req.body)
  let venue = req.body
  gigService.newVenue(venue, (err, addedVenue) => {
    if(err){
      console.error(err)
      res.status(501).send(err);
    }
    res.send(JSON.stringify(addedVenue));
  })
});

//View gigs by ID
app.get('/api/gigs/view/:id', (req, res) => {
      gigService.findGigById(req.params.id, function(err, gig) {
        if (err) {
          console.error(err)
            res.status(500).send(err);
        }
        res.json(gig)
      })
});

app.delete('/api/gigs/remove/:id', (req, res) => {
      gigService.removeById(req.params.id, function(err, gig) {
        if (err) {
          console.error(err)
            res.status(500).send(err);
        }
        res.json(gig)
      })
});

app.use(express.static('public'))

app.listen(3000, () => {
  console.log('listening on port 3000');
});
