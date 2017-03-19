var cases_ = function() {
  module('Table');
  
  test('define', function() {
    var Fixture1 = Tamotsu.Table.define({ sheetName: 'Agents' });
    equal('Agents', Fixture1.sheet.getName());
    var Fixture2 = Tamotsu.Table.define({ sheetName: 'No data' });
    equal('No data', Fixture2.sheet.getName());
  });
  
  test('define with mixin option', function() {
    var Fixture = Tamotsu.Table.define({
      sheetName: 'Agents',
      mixin: {
        fullName: function() { return this['First Name'] + ' ' + this['Last Name']; },
      },
    });
    var fixture = Fixture.first();
    equal('Charles Bartowski', fixture.fullName());
  });

  test('columns', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    deepEqual(['#', 'First Name', 'Last Name', 'Gender'], Fixture.columns());
  });
  
  test('columnABCFor',function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    equal('B', Fixture.columnABCFor('First Name'));
  });
  
  test('first', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = Fixture.first();
    equal(1, fixture['#']);
    equal('Charles',   fixture['First Name']);
    equal('Bartowski', fixture['Last Name']);
    equal('Male',      fixture['Gender']);
  });
  
  test('first with no records', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'No data' });
    equal(null, Fixture.first());
  });
  
  test('last', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = Fixture.last();
    equal(3, fixture['#']);
    equal('John',  fixture['First Name']);
    equal('Casey', fixture['Last Name']);
    equal('Male',  fixture['Gender']);
  });
  
  test('last with no records', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'No data' });
    equal(null, Fixture.last());
  });
  
  test('all', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    Fixture.all().forEach(function(record, i) {
      equal(i + 1, record['#']);
    });
  });
  
  test('all with no records', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'No data' });
    deepEqual([], Fixture.all());
  });
  
  test('new', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = new Fixture({ 'First Name': 'Johnny', 'Last Name': 'Rotten', 'Invalid attr': 'ignore it' });
    equal('Johnny', fixture['First Name']);
    equal('Rotten', fixture['Last Name']);
    equal(undefined, fixture['Gender']);
    equal(undefined, fixture['Invalid attr']);
  });
  
  test('create', function() {
    useFixture_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var fixture = new Fixture({ 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male' });
      fixture.save();
      var values = sheet.getRange('A5:D5').getValues()[0];
      equal(4, values[0]);
      equal('Morgan', values[1]);
      equal('Grimes', values[2]);
      equal('Male',   values[3]);
    });
  });
  
  test('update', function() {
    useFixture_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var fixture = Fixture.first();
      fixture['First Name'] = 'Johnny';
      fixture['Last Name'] = 'Rotten';
      fixture.save();
      var values = sheet.getRange('B2:C2').getValues()[0];
      equal('Johnny', values[0]);
      equal('Rotten', values[1]);
    });
  });
  
  test('destroy', function() {
    useFixture_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var fixture = Fixture.first();
      fixture.destroy();
      fixture = Fixture.first();
      equal(2, fixture['#'])
      equal('Sarah',  fixture['First Name'])
      equal('Walker', fixture['Last Name'])
      equal('Female', fixture['Gender'])
    });
  });
  
  test('where', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture
      .where(function(agent) { return agent['Gender'] === 'Male'; })
      .all();
    equal(2, fixtures.length);
    equal('Charles', fixtures[0]['First Name']);
    equal('John',    fixtures[1]['First Name']);
  });
  
  test('where then get no result', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture
      .where(function(agent) { return agent['First Name'] === 'Devon'; })
      .all();
    deepEqual([], fixtures);
  });
  
  test('where with chained predicates', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture
      .where(function(agent) { return agent['Gender'] === 'Male'; })
      .where(function(agent) { return agent['First Name'].indexOf('a') > -1; })
      .all();
    equal(1, fixtures.length);
    equal('Charles', fixtures[0]['First Name']);
  });
  
  test('where then update', function() {
    useFixture_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var fixture = Fixture
        .where(function(agent) { return agent['Gender'] === 'Female'; })
        .all()[0];
      fixture['First Name'] = 'Eleanor';
      fixture['Last Name'] = 'Bartowski';
      fixture.save();
      var values = sheet.getRange('B3:C3').getValues()[0];
      equal('Eleanor',   values[0]);
      equal('Bartowski', values[1]);
    });
  });
  
  test('where then get first', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = Fixture
      .where(function(agent) { return agent['Gender'] === 'Male'; })
      .first();
    equal('Charles', fixture['First Name']);
  });
  
  test('where then get last', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = Fixture
      .where(function(agent) { return agent['Gender'] === 'Male'; })
      .last();
    equal('John', fixture['First Name']);
  });
  
  test('order', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture
      .order(function(t1, t2) { return t1['First Name'] < t2['First Name'] ? -1 : 1; })
      .all();
    equal(3, fixtures.length);
    equal('Charles', fixtures[0]['First Name']);
    equal('John',    fixtures[1]['First Name']);
    equal('Sarah',   fixtures[2]['First Name']);
  });
}