var specs_ = {
  test_new_Table: function(h) {
    var Fixture = h.defineFixture();
    GSUnit.assertEquals('fixture', Fixture.sheet.getName());
  },
  
  test_columns: function(h) {
    var Fixture = h.defineFixture();
    GSUnit.assertArrayEquals(['#', 'First Name', 'Last Name'], Fixture.columns());
  },
  
  test_first: function(h) {
    var Fixture = h.defineFixture();
    var first = Fixture.first();
    GSUnit.assertEquals(1, first['#'])
    GSUnit.assertEquals('Charles', first['First Name'])
    GSUnit.assertEquals('Bartowski ', first['Last Name'])
  },
  
  test_last: function(h) {
    var Fixture = h.defineFixture();
    var last = Fixture.last();
    GSUnit.assertEquals(3, last['#'])
    GSUnit.assertEquals('John', last['First Name'])
    GSUnit.assertEquals('Casey', last['Last Name'])
  },
  
  test_all: function(h) {
    var Fixture = h.defineFixture();
    Fixture.all().forEach(function(record, i) {
      GSUnit.assertEquals(i + 1, record['#'])
    });
  },
};

var Helper_ = (function() {
  var Helper_ = function() {};
  
  var _p = Helper_.prototype;
  
  _p.defineFixture = function() {
    return Tamotsu.Table.define({ sheetName: 'fixture' });
  };

  return Helper_;
})();


function runAll() {
  Tamotsu.init(SpreadsheetApp.getActive());
  var helper = new Helper_();
  for (var spec in specs_) {
    specs_[spec](helper);
  }
  Logger.log('All specs were passed!')
}