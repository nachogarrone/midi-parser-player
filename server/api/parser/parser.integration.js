'use strict';

var app = require('../..');
import request from 'supertest';

var newParser;

describe('Parser API:', function() {
  describe('GET /api/parsers', function() {
    var parsers;

    beforeEach(function(done) {
      request(app)
        .get('/api/parsers')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          parsers = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(parsers).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/parsers', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/parsers')
        .send({
          name: 'New Parser',
          info: 'This is the brand new parser!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newParser = res.body;
          done();
        });
    });

    it('should respond with the newly created parser', function() {
      expect(newParser.name).to.equal('New Parser');
      expect(newParser.info).to.equal('This is the brand new parser!!!');
    });
  });

  describe('GET /api/parsers/:id', function() {
    var parser;

    beforeEach(function(done) {
      request(app)
        .get(`/api/parsers/${newParser._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          parser = res.body;
          done();
        });
    });

    afterEach(function() {
      parser = {};
    });

    it('should respond with the requested parser', function() {
      expect(parser.name).to.equal('New Parser');
      expect(parser.info).to.equal('This is the brand new parser!!!');
    });
  });

  describe('PUT /api/parsers/:id', function() {
    var updatedParser;

    beforeEach(function(done) {
      request(app)
        .put(`/api/parsers/${newParser._id}`)
        .send({
          name: 'Updated Parser',
          info: 'This is the updated parser!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedParser = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedParser = {};
    });

    it('should respond with the original parser', function() {
      expect(updatedParser.name).to.equal('New Parser');
      expect(updatedParser.info).to.equal('This is the brand new parser!!!');
    });

    it('should respond with the updated parser on a subsequent GET', function(done) {
      request(app)
        .get(`/api/parsers/${newParser._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let parser = res.body;

          expect(parser.name).to.equal('Updated Parser');
          expect(parser.info).to.equal('This is the updated parser!!!');

          done();
        });
    });
  });

  describe('PATCH /api/parsers/:id', function() {
    var patchedParser;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/parsers/${newParser._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Parser' },
          { op: 'replace', path: '/info', value: 'This is the patched parser!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedParser = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedParser = {};
    });

    it('should respond with the patched parser', function() {
      expect(patchedParser.name).to.equal('Patched Parser');
      expect(patchedParser.info).to.equal('This is the patched parser!!!');
    });
  });

  describe('DELETE /api/parsers/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/parsers/${newParser._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when parser does not exist', function(done) {
      request(app)
        .delete(`/api/parsers/${newParser._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
