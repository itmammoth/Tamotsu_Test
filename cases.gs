var cases_ = function() {
  module('Table');
  
  test('define', function() {
    var Fixture1 = Tamotsu.Table.define({ sheetName: 'Agents' });
    equal(Fixture1.sheetName, 'Agents');
    var Fixture2 = Tamotsu.Table.define({ sheetName: 'No data' });
    equal(Fixture2.sheetName, 'No data');
  });
  
  test('define with class properties', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents', something: 'Something' });
    equal(Fixture.something, 'Something');
  });
  
  test('define with instance properties', function() {
    var Fixture = Tamotsu.Table.define({
      sheetName: 'Agents',
    }, {
      fullName: function() {
        return this['First Name'] + ' ' + this['Last Name'];
      },
    });
    var fixture = Fixture.first();
    equal(fixture.fullName(), 'Charles Bartowski');
  });

  test('columns', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    deepEqual(Fixture.columns(), ['#', 'First Name', 'Last Name', 'Gender', 'Salary']);
  });

  test('columns by cache', function() {
    var Fixture1 = Tamotsu.Table.define({ sheetName: 'Agents' });
    var Fixture2 = Tamotsu.Table.define({ sheetName: 'No data' });
    deepEqual(Fixture1.columns(), ['#', 'First Name', 'Last Name', 'Gender', 'Salary']);
    deepEqual(Fixture2.columns(), ['#', 'Attr']);
  });

  test('columnIndexOf', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    deepEqual(Fixture.columnIndexOf('Gender'), 3);
  });
  
  test('columnABCFor',function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    equal(Fixture.columnABCFor('First Name'), 'B');
  });
  
  test('first', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = Fixture.first();
    equal(fixture['#'], 1);
    equal(fixture['First Name'], 'Charles');
    equal(fixture['Last Name'], 'Bartowski');
    equal(fixture['Gender'], 'Male');
    equal(fixture['Salary'], 100);
    equal(fixture.row_, 2);
  });
  
  test('first with no records', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'No data' });
    equal(Fixture.first(), null);
  });
  
  test('last', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = Fixture.last();
    equal(fixture['#'], 3);
    equal(fixture['First Name'], 'John');
    equal(fixture['Last Name'], 'Casey');
    equal(fixture['Gender'], 'Male');
    equal(fixture['Salary'], 200);
    equal(fixture.row_, 4);
  });
  
  test('last with no records', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'No data' });
    equal(Fixture.last(), null);
  });
  
  test('find', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = Fixture.find(2);
    equal(fixture['#'], 2);
    equal(fixture['First Name'], 'Sarah');
    equal(fixture['Last Name'], 'Walker');
    equal(fixture['Gender'], 'Female');
    equal(fixture['Salary'], 300);
    equal(fixture.row_, 3);
  });
  
  test('find with invalid id', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    try {
      var fixture = Fixture.find(999);
      equal(1, 2); // for failure
    } catch (e) {
      equal(e, 'Record not found [id=999]');
    }
  });
  
  test('find with not "#" column', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Other id', idColumn: 'id' });
    equal(Fixture.find(3)['country'], 'U.K.');
  });
  
  test('all', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    Fixture.all().forEach(function(record, i) {
      equal(record['#'], i + 1);
      equal(record.row_, i + 2);
    });
  });
  
  test('pluck', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    deepEqual(Fixture.pluck('Last Name'), ['Bartowski', 'Walker', 'Casey']);
  });
  
  test('sum', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    equal(Fixture.sum('Salary'), 600);
  });
  
  test('max', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    equal(Fixture.max('Salary'), 300);
  });
  
  test('min', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    equal(Fixture.min('Salary'), 100);
  });
  
  test('new', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = new Fixture({ 'First Name': 'Devon', 'Last Name': 'Woodcomb', 'Invalid attr': 'ignore it' });
    equal(fixture['First Name'], 'Devon');
    equal(fixture['Last Name'], 'Woodcomb');
    equal(fixture['Gender'], undefined);
    equal(fixture['Invalid attr'], undefined);
  });
  
  test('validate on', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture1 = Tamotsu.Table.define({ sheetName: sheet.getName() }, {
        validate: function(on) {
          equal(on, 'create');
        },
      });
      Fixture1.create({});
      
      var Fixture2 = Tamotsu.Table.define({ sheetName: sheet.getName() }, {
        validate: function(on) {
          equal(on, 'update');
        },
      });
      Fixture2.first().save();
    });
  });
  
  test('validate as save', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({
        sheetName: sheet.getName()
      }, {
        validate: function(on) {
          if (!this['First Name']) this.errors['First Name'] = "can't be blank";
        },
      });
      var fixture = new Fixture();
      equal(fixture.save(), false);
      equal(fixture.errors['First Name'], "can't be blank");
    });
  });
  
  test('validate as create', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({
        sheetName: sheet.getName()
      }, {
        validate: function(on) {
          if (!this['First Name']) this.errors['First Name'] = "can't be blank";
        },
      });
      equal(Fixture.create({}), false);
    });
  });
  
  test('create', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var fixture = Fixture.create({ 'First Name': 'Morgan', 'Last Name': 'Grimes' });
      equal(fixture.row_, 5);
      var values = sheet.getRange('A5:E5').getValues()[0];
      equal(values[0], 4);
      equal(values[1], 'Morgan');
      equal(values[2], 'Grimes');
      equal(values[3], '');
      equal(values[4], '');
    });
  });
  
  test('save as create', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var fixture = new Fixture({ 'First Name': 'Morgan', 'Last Name': 'Grimes' });
      fixture.save();
      var values = sheet.getRange('A5:E5').getValues()[0];
      equal(values[0], 4);
      equal(values[1], 'Morgan');
      equal(values[2], 'Grimes');
      equal(values[3], '');
      equal(values[4], '');
    });
  });
  
  test('save as update', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var fixture = Fixture.first();
      fixture['First Name'] = 'Devon';
      fixture['Last Name'] = 'Woodcomb';
      fixture.save();
      var values = sheet.getRange('B2:C2').getValues()[0];
      equal(values[0], 'Devon');
      equal(values[1], 'Woodcomb');
    });
  });
  
  test('destroy', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var fixture = Fixture.first();
      fixture.destroy();
      fixture = Fixture.first();
      equal(2, fixture['#'])
      equal(fixture['First Name'], 'Sarah')
      equal(fixture['Last Name'], 'Walker')
      equal(fixture['Gender'], 'Female')
      equal(fixture['Salary'], 300)
      equal(fixture.row_, 2)
    });
  });
  
  test('where', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture
      .where(function(agent) { return agent['Gender'] === 'Male'; })
      .all();
    equal(fixtures.length, 2);
    equal(fixtures[0]['First Name'], 'Charles');
    equal(fixtures[1]['First Name'], 'John');
  });
  
  test('where then get no result', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture
      .where(function(agent) { return agent['First Name'] === 'Devon'; })
      .all();
    deepEqual(fixtures, []);
  });
  
  test('where with chained predicates', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture
      .where(function(agent) { return agent['Gender'] === 'Male'; })
      .where(function(agent) { return agent['First Name'].indexOf('a') > -1; })
      .all();
    equal(fixtures.length, 1);
    equal(fixtures[0]['First Name'], 'Charles');
  });
  
  test('where with object condition', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture.where({ 'Gender': 'Male', 'Last Name': 'Bartowski' }).all();
    equal(fixtures.length, 1);
    equal(fixtures[0]['First Name'], 'Charles');
  });
  
  test('where then pluck', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var genders = Fixture
      .where(function(agent) { return agent['Gender'] === 'Male'; })
      .pluck('Gender');
    equal(genders.length, 2);
    deepEqual(genders, ['Male', 'Male']);
  });
  
  test('where then sum', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var total = Fixture
      .where(function(agent) { return agent['Gender'] === 'Male'; })
      .sum('Salary');
    equal(total, 300);
  });
  
  test('where then max', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var total = Fixture
      .where(function(agent) { return agent['Gender'] === 'Male'; })
      .max('Salary');
    equal(total, 200);
  });
  
  test('where then min', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var total = Fixture
      .where(function(agent) { return agent['Gender'] === 'Male'; })
      .min('Salary');
    equal(total, 100);
  });
  
  test('where then update', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var fixture = Fixture
        .where(function(agent) { return agent['Gender'] === 'Female'; })
        .all()[0];
      fixture['First Name'] = 'Eleanor';
      fixture['Last Name'] = 'Bartowski';
      fixture.save();
      var values = sheet.getRange('B3:C3').getValues()[0];
      equal(values[0], 'Eleanor');
      equal(values[1], 'Bartowski');
    });
  });
  
  test('where then get first', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = Fixture
      .where(function(agent) { return agent['Gender'] === 'Male'; })
      .first();
    equal(fixture['First Name'], 'Charles');
  });
  
  test('where then get last', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = Fixture
      .where(function(agent) { return agent['Gender'] === 'Male'; })
      .last();
    equal(fixture['First Name'], 'John');
  });
  
  test('order', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture
      .order(function(t1, t2) { return t1['Salary'] < t2['Salary'] ? -1 : 1; })
      .all();
    equal(3, fixtures.length);
    equal(fixtures[0]['First Name'], 'Charles');
    equal(fixtures[1]['First Name'], 'John');
    equal(fixtures[2]['First Name'], 'Sarah');
  });
  
  test('order with string comparator as asc', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture.order('Salary').all();
    equal(3, fixtures.length);
    equal(fixtures[0]['First Name'], 'Charles');
    equal(fixtures[1]['First Name'], 'John');
    equal(fixtures[2]['First Name'], 'Sarah');
  });
  
  test('order with string comparator as desc', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture.order('First Name DESC').all();
    equal(3, fixtures.length);
    equal(fixtures[0]['First Name'], 'Sarah');
    equal(fixtures[1]['First Name'], 'John');
    equal(fixtures[2]['First Name'], 'Charles');
  });
  
  test('order with string comparator as combined', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture.order('Gender desc, Salary DESC').all();
    equal(3, fixtures.length);
    equal(fixtures[0]['First Name'], 'John');
    equal(fixtures[1]['First Name'], 'Charles');
    equal(fixtures[2]['First Name'], 'Sarah');
  });
}