/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

process.env.DB   = 'life-coach-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    cookie  = null,
    app     = require('../../app/index'),
    request = require('supertest');

describe('goals', function(){
  before(function(done){
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      request(app)
      .post('/login')
      .send('email=sue@aol.com')
      .send('password=1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0];
        done();
      });
    });
  });

  describe('get /', function(){
    it('should fetch the home page', function(done){
      // The following three lines are the same as line 16) //
      request(app)
      .get('/')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Home');
        done();
      });
    });
  });

  describe('get /goals/new', function(){
    it('should fetch the new goals page', function(done){
      // The following three lines are the same as line 16) //
      request(app)
      .get('/goals/new')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Name');
        expect(res.text).to.include('Due');
        expect(res.text).to.include('Tags');
        done();
      });
    });
  });

  describe('post /goals', function(){
    it('should create a new goal and redirect', function(done){
      // The following three lines are the same as line 16) //
      request(app)
      .post('/goals')
      .set('cookie', cookie)
      .send('name=be+a+doctor&due=2014-11-30&tags=a%2Cb%2Cc%2Cd')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('post /goals', function(){
    it('should show the new goals page', function(done){
      // The following three lines are the same as line 16) //
      request(app)
      .get('/goals')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('doctor');
        expect(res.text).to.include('marathon');
        done();
      });
    });
  });

  describe('get /goals/3', function(){
    it('should show the specific goal page', function(done){
      // The following three lines are the same as line 16) //
      request(app)
      .get('/goals/a00000000000000000000001')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('doctor');
        done();
      });
    });
  });

  describe('get /goals/3', function(){
    it('should show a specific goal page', function(done){
      // The following three lines are the same as line 16) //
      request(app)
      .get('/goals/b00000000000000000000001')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('get /goals/3', function(){
    it('should create a task for a specific goal', function(done){
      // The following three lines are the same as line 16) //
      request(app)
      .get('/goals/b00000000000000000000002/tasks')
      .set('cookie', cookie)
      .send('name=Get+Shoes&description=Go+Buy+Shoes&difficulty=Hard&rank=3')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });
});
