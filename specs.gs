var specs_ = {
  test_define_table: function(h) {
    var Fixture1 = Tamotsu.Table.define({ sheetName: 'fixture1' });
    GSUnit.assertEquals('fixture1', Fixture1.sheet.getName());
    var Fixture2 = Tamotsu.Table.define({ sheetName: 'fixture2' });
    GSUnit.assertEquals('fixture2', Fixture2.sheet.getName());
  },
  
  test_columns: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'fixture1' });
    GSUnit.assertArrayEquals(['#', 'First Name', 'Last Name'], Fixture.columns());
  },
  
  test_first_when_having_data: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'fixture1' });
    var fixture = Fixture.first();
    GSUnit.assertEquals(1, fixture['#'])
    GSUnit.assertEquals('Charles', fixture['First Name'])
    GSUnit.assertEquals('Bartowski ', fixture['Last Name'])
  },
  
  test_first_when_no_data: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'fixture2' });
    GSUnit.assertNull(Fixture.first());
  },
  
  test_last_when_having_data: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'fixture1' });
    var fixture = Fixture.last();
    GSUnit.assertEquals(3, fixture['#']);
    GSUnit.assertEquals('John', fixture['First Name']);
    GSUnit.assertEquals('Casey', fixture['Last Name']);
  },
  
  test_last_when_no_data: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'fixture2' });
    GSUnit.assertNull(Fixture.last());
  },
  
  test_all_when_having_data: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'fixture1' });
    Fixture.all().forEach(function(record, i) {
      GSUnit.assertEquals(i + 1, record['#']);
    });
  },
  
  test_all_when_no_data: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'fixture2' });
    GSUnit.assertArrayEquals([], Fixture.all());
  },
  
  test_new_table_instance: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'fixture1' });
    var fixture = new Fixture({ 'First Name': 'Johnny', 'Last Name': 'Rotten', 'Invalid attr': 'ignore it' });
    GSUnit.assertEquals('Johnny', fixture['First Name']);
    GSUnit.assertEquals('Rotten', fixture['Last Name']);
    GSUnit.assertUndefined(fixture['Invalid attr']);
  },
  
  test_update: function(h) {
    var Fixture = Tamotsu.Table.define({ sheetName: 'fixture1' });
    var fixture = Fixture.first();
    fixture['First Name'] = 'Johnny';
    fixture['Last Name'] = 'Rotten';
    // TODO: ここから
    GSUnit.assertEquals('saved!', fixture.save());
  },
};

var Helper_ = (function() {
  var Helper_ = function() {};
  
  var _p = Helper_.prototype;
  
  return Helper_;
})();


function runAll() {
  Tamotsu.register(SpreadsheetApp.getActive());
  var helper = new Helper_();
  for (var spec in specs_) {
    specs_[spec](helper);
  }
  Logger.log('All specs were passed!')
}