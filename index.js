//build route at api/gigs/ to list json array, all gigs
//create new route (app.get)
//route will need to call service layer (have to require it in index file)
//send out a json response (require setting the content type header and
//stringifying object you get from service layer)
const express = require ('express');
const app = express();
const gigRouter = express.Router();
const gigService = require('./services/gigService.js');

// //gigRouter.route('/')
//   .get(function(req,res) {
//     res.setHeader('Content-Type', 'application/json');
//     res.send(JSON.stringify(gigService));
//   });
//
// app.use('/api/gigs', gigRouter);

app.get('/api/gigs', (req,res) => {
  gigService.allGigs((err, gigs) => {
    //todo: use node style err cb
    if(err){console.error(err)}
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(gigs));
  })
});

app.get('/', (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log('hi');
});
