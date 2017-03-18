var specs_ = {
  test_define_table: function(h) {
    var Fixture1 = Tamotsu.Table.define({ sheetName: 'Agents' });
    GSUnit.assertEquals('Agents', Fixture1.sheet.getName());
    var Fixture2 = Tamotsu.Table.define({ sheetName: 'No data' });
    GSUnit.assertEquals('No data', Fixture2.sheet.getName());
  },
  
  test_columns: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    GSUnit.assertArrayEquals(['#', 'First Name', 'Last Name'], Fixture.columns());
  },
  
  test_first_when_having_data: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = Fixture.first();
    GSUnit.assertEquals(1, fixture['#'])
    GSUnit.assertEquals('Charles', fixture['First Name'])
    GSUnit.assertEquals('Bartowski', fixture['Last Name'])
  },
  
  test_first_when_no_data: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'No data' });
    GSUnit.assertNull(Fixture.first());
  },
  
  test_last_when_having_data: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = Fixture.last();
    GSUnit.assertEquals(3, fixture['#']);
    GSUnit.assertEquals('John', fixture['First Name']);
    GSUnit.assertEquals('Casey', fixture['Last Name']);
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
    GSUnit.assertUndefined(fixture['Invalid attr']);
  },
  
  test_create: function(h) {
    h.withRollback('Agents', function(sheetName) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheetName });
      var fixture = new Fixture({ 'First Name': 'Morgan', 'Last Name': 'Grimes' });
      fixture.save();
      var sheet = h.ss.getSheetByName(sheetName);
      var values = sheet.getRange('A5:C5').getValues()[0];
      GSUnit.assertEquals(4, values[0]);
      GSUnit.assertEquals('Morgan', values[1]);
      GSUnit.assertEquals('Grimes', values[2]);
    });
  },
  
  test_update: function(h) {
    h.withRollback('Agents', function(sheetName) {
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
    h.withRollback('Agents', function(sheetName) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheetName });
      var fixture = Fixture.first();
      fixture.destroy();
      fixture = Fixture.first();
      GSUnit.assertEquals(2, fixture['#'])
      GSUnit.assertEquals('Sarah', fixture['First Name'])
      GSUnit.assertEquals('Walker', fixture['Last Name'])
    });
  },
};

var Helper_ = (function() {
  var Helper_ = function(ss) {
    this.ss = ss;
  };
  
  var _p = Helper_.prototype;
  
  _p.withRollback = function(name, spec) {
    var sheet = this.ss.getSheetByName(name).copyTo(this.ss);
    try {
      spec(sheet.getName());
    } finally {
      this.ss.deleteSheet(sheet)
    }
  };
  
  return Helper_;
})();


function runAll() {
  var ss = SpreadsheetApp.getActive();
  Tamotsu.register(ss);
  var helper = new Helper_(ss);
  for (var spec in specs_) {
    specs_[spec](helper);
  }
  Logger.log('All specs were passed!')
}