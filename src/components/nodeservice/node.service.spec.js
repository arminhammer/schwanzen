'use strict';

describe('NodeService', function(){

  beforeEach(module('schwanzen'));

  var NodeService;
  var $log;

  beforeEach(inject(function(_NodeService_, _$log_) {

    NodeService = _NodeService_;
    $log = _$log_;

  }));

  describe('when started', function() {

    it('$fs should be not be initialized', function() {

      expect(NodeService.$fs).toEqual(null);

    });

    it('$Tail should be not be initialized', function() {

      expect(NodeService.$Tail).toEqual(null);

    });

  });

});
