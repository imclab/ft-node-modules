var assert = require("assert"),
    wrapper = require("../wrapper")

// Integration-style unit test. Relies on ft.com wrapper endpoint
describe('Wrapper', function(){
    describe('#fetch()', function(){
        it('should fetch valid wrapper without error', function(done){
            wrapper.fetch("code-sample",function(err, body){
                done();
            })
        })
    });

    describe('#fetch()', function(){
        it('should fetch invalid wrapper without error', function(done){
            wrapper.fetch("no-exist",function(err, body){
                assert.equal(err,404);
                done();
            })
        })
    })
})