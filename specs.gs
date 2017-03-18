var specs_ = {
  test_table_define: function(h) {
    var Fixture1 = Tamotsu.Table.define({ sheetName: 'Agents' });
    GSUnit.assertEquals('Agents', Fixture1.sheet.getName());
    var Fixture2 = Tamotsu.Table.define({ sheetName: 'No data' });
    GSUnit.assertEquals('No data', Fixture2.sheet.getName());
  },
  
  test_table_define_with_mixin: function() {
    var Fixture = Tamotsu.Table.define({
      sheetName: 'Agents',
      mixin: {
        fullName: function() { return this['First Name'] + ' ' + this['Last Name']; },
      },
    });
    var fixture = Fixture.first();
    GSUnit.assertEquals('Charles Bartowski', fixture.fullName());
  },
  
  test_columns: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    GSUnit.assertArrayEquals(['#', 'First Name', 'Last Name', 'Gender'], Fixture.columns());
  },
  
  test_columnABCFor: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    GSUnit.assertEquals('B', Fixture.columnABCFor('First Name'));
  },
  
  test_first_when_having_data: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = Fixture.first();
    GSUnit.assertEquals(1, fixture['#'])
    GSUnit.assertEquals('Charles',   fixture['First Name'])
    GSUnit.assertEquals('Bartowski', fixture['Last Name'])
    GSUnit.assertEquals('Male',      fixture['Gender'])
  },
  
  test_first_when_no_data: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'No data' });
    GSUnit.assertNull(Fixture.first());
  },
  
  test_last_when_having_data: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = Fixture.last();
    GSUnit.assertEquals(3, fixture['#']);
    GSUnit.assertEquals('John',  fixture['First Name']);
    GSUnit.assertEquals('Casey', fixture['Last Name']);
    GSUnit.assertEquals('Male',  fixture['Gender']);
  },
  
  test_last_when_no_data: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'No data' });
    GSUnit.assertNull(Fixture.last());
  },
  
  test_all_when_having_data: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    Fixture.all().forEach(function(record, i) {
      GSUnit.assertEquals(i + 1, record['#']);
    });
  },
  
  test_all_when_no_data: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'No data' });
    GSUnit.assertArrayEquals([], Fixture.all());
  },
  
  test_new_table_instance: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = new Fixture({ 'First Name': 'Johnny', 'Last Name': 'Rotten', 'Invalid attr': 'ignore it' });
    GSUnit.assertEquals('Johnny', fixture['First Name']);
    GSUnit.assertEquals('Rotten', fixture['Last Name']);
    GSUnit.assertUndefined(fixture['Gender']);
    GSUnit.assertUndefined(fixture['Invalid attr']);
  },
  
  test_create: function(h) {
    h.withCopied('Agents', function(sheetName) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheetName });
      var fixture = new Fixture({ 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male' });
      fixture.save();
      var sheet = h.ss.getSheetByName(sheetName);
      var values = sheet.getRange('A5:D5').getValues()[0];
      GSUnit.assertEquals(4, values[0]);
      GSUnit.assertEquals('Morgan', values[1]);
      GSUnit.assertEquals('Grimes', values[2]);
      GSUnit.assertEquals('Male',   values[3]);
    });
  },
  
  test_update: function(h) {
    h.withCopied('Agents', function(sheetName) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheetName });
      var fixture = Fixture.first();
      fixture['First Name'] = 'Johnny';
      fixture['Last Name'] = 'Rotten';
      fixture.save();
      var sheet = h.ss.getSheetByName(sheetName);
      var values = sheet.getRange('B2:C2').getValues()[0];
      GSUnit.assertEquals('Johnny', values[0]);
      GSUnit.assertEquals('Rotten', values[1]);
    });
  },
  
  test_destroy: function(h) {
    h.withCopied('Agents', function(sheetName) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheetName });
      var fixture = Fixture.first();
      fixture.destroy();
      fixture = Fixture.first();
      GSUnit.assertEquals(2, fixture['#'])
      GSUnit.assertEquals('Sarah',  fixture['First Name'])
      GSUnit.assertEquals('Walker', fixture['Last Name'])
      GSUnit.assertEquals('Female', fixture['Gender'])
    });
  },
  
  test_where_then_get_all: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture
      .where(function(agent) { return agent['Gender'] === 'Male'; })
      .all();
    GSUnit.assertEquals(2, fixtures.length);
    GSUnit.assertEquals('Charles', fixtures[0]['First Name']);
    GSUnit.assertEquals('John',    fixtures[1]['First Name']);
  },
  
  test_where_no_result: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture
      .where(function(agent) { return agent['First Name'] === 'Devon'; })
      .all();
    GSUnit.assertArrayEquals([], fixtures);
  },
  
  test_where_chained_predicates: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture
      .where(function(agent) { return agent['Gender'] === 'Male'; })
      .where(function(agent) { return agent['First Name'].indexOf('a') > -1; })
      .all();
    GSUnit.assertEquals(1, fixtures.length);
    GSUnit.assertEquals('Charles', fixtures[0]['First Name']);
  },
  
  test_where_then_update: function(h) {
    h.withCopied('Agents', function(sheetName) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheetName });
      var fixture = Fixture
        .where(function(agent) { return agent['Gender'] === 'Female'; })
        .all()[0];
      fixture['First Name'] = 'Eleanor';
      fixture['Last Name'] = 'Bartowski';
      fixture.save();
      var sheet = h.ss.getSheetByName(sheetName);
      var values = sheet.getRange('B3:C3').getValues()[0];
      GSUnit.assertEquals('Eleanor',   values[0]);
      GSUnit.assertEquals('Bartowski', values[1]);
    });
  },
  
  test_where_then_get_last: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = Fixture
      .where(function(agent) { return agent['Gender'] === 'Male'; })
      .first();
    GSUnit.assertEquals('Charles', fixture['First Name']);
  },
  
  test_where_then_get_last: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = Fixture
      .where(function(agent) { return agent['Gender'] === 'Male'; })
      .last();
    GSUnit.assertEquals('John', fixture['First Name']);
  },
  
  test_order_then_get_all: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture
      .order(h.orderByFirstNameAsc)
      .all();
    GSUnit.assertEquals(3, fixtures.length);
    GSUnit.assertEquals('Charles', fixtures[0]['First Name']);
    GSUnit.assertEquals('John',    fixtures[1]['First Name']);
    GSUnit.assertEquals('Sarah',   fixtures[2]['First Name']);
  },
};

var Helper_ = (function() {
  var Helper_ = function(ss) {
    this.ss = ss;
  };
  
  var _p = Helper_.prototype;
  
  _p.withCopied = function(name, spec) {
    var sheet = this.ss.getSheetByName(name).copyTo(this.ss);
    try {
      spec(sheet.getName());
    } finally {
      this.ss.deleteSheet(sheet)
    }
  };
  
  _p.orderByFirstNameAsc = function(t1, t2) {
    return t1['First Name'] < t2['First Name'] ? -1 : 1;
  };
  
  return Helper_;
})();


function runAll() {
  var ss = SpreadsheetApp.getActive();
  Tamotsu.initialize(ss);
  var helper = new Helper_(ss);
  for (var spec in specs_) {
    specs_[spec](helper);
  }
  Logger.log('All specs were passed!')
}