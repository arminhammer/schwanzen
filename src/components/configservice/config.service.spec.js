'use strict';

describe('ConfigService', function(){

  beforeEach(module('schwanzen'));

  var ConfigService;
  var $log;

  beforeEach(inject(function(_ConfigService_, _$log_) {

    ConfigService = _ConfigService_;
    $log = _$log_;

  }));

  describe('when started', function() {

    it('the maxLength should be 500000', function() {

      expect(ConfigService.maxLength).toEqual(500000);

    });

  });

});
