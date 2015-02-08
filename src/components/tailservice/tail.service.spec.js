'use strict';

describe('TailService', function(){

  beforeEach(module('schwanzen'));

  var TailService;
  var $log;
  var $q;
  var NodeService;

  beforeEach(inject(function(_TailService_, _$log_, _$q_, _NodeService_) {

    TailService = _TailService_;
    $log = _$log_;
    $q = _$q_;
    NodeService = _NodeService_;

  }));

  describe('when running buildTail()', function() {

    var filename;
    var tail;

    beforeEach(function() {

      filename = 'test.txt';
      tail = TailService.buildTail(filename);

    });


    it('buildTail should return a Tail object', function() {

      expect(tail).toBeDefined();

    });

  });

});
