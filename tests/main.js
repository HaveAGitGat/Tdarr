import assert from 'assert';

describe('Tdarr', function() {
  it('package.json has correct name', async function() {
    const {name} = await import('../package.json');
    assert.strictEqual(name, 'Tdarr');
  });

  if (Meteor.isClient) {
    it('client is not server', function() {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it('server is not client', function() {
      assert.strictEqual(Meteor.isClient, false);
    });
  }

  it('Checking date function returns string', function() {
    import dateFuncs from '../server/dateFuncs.js';

    //e.g. 03-April-2020-11-56-14
    const date = dateFuncs.getDateNow()
    assert.strictEqual(typeof date,'string');
  });


  it('Checking time function returns string', function() {

    //e.g. 03-April-2020-11-56-14
    const date = Meteor.call('getTimeNow', (error, result) => { 
      assert.strictEqual(typeof date,'string');
    })
  });





  
});
