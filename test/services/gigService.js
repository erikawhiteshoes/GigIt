const svc = require('../../services/gigService.js')
const app = require("../index");
const assert = require('chai').assert
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);



describe ('gigService', function() {
  describe ('Preconditions', function() {
    it('Should be seeded with two gigs', function(cb) {
      svc.allGigs((err, docs) => {
        if(err) {
          throw err
        } else {
          assert.equal(2, docs.length)
          cb()
        }
      })
    })
  })
  describe ('Inserting Gigs', function(){
    it('Should insert gigs', () => {
      
    })

  })
})
