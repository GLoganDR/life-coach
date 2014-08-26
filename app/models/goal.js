'use strict';

function Goal(o, userId){
  this.name    = o.name;
  this.due   =   new Date(o.due);
  this.userId = userId;
  this.tags  = o.tags.split(',');
}

Object.defineProperty(Goal, 'collection', {
  get: function(){return global.mongodb.collection('goals');}
});

Goal.create = function(o, userId, cb){
  var g = new Goal(o, userId);
  Goal.collection.save(g, cb);
};

Goal.findAllByUserId = function(userId, cb){
  Goal.collection.find({userId:userId}).toArray(cb);
};

module.exports = Goal;
