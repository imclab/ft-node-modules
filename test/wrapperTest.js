var assert = require("assert"),
    wrapper = require("../wrapper")

describe('Wrapper', function(){
    describe('#fetch()', function(){
        it('should fetch without error', function(done){
            wrapper.fetch("code-sample",function(err, body){
                done();
            })
        })
    })
})