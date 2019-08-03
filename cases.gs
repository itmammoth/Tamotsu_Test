var makeShiftForSheet = function (sheet, rowShift, columnShift, props) {
  props = props || {};
  sheet.getRange("A1:E").moveTo(sheet.getRange(1 + rowShift, 1 + columnShift));
  var Fixture = Tamotsu.Table.define(Object.assign({ sheetName: sheet.getName(), rowShift: rowShift, columnShift: columnShift }, props));

  return Fixture;
};

var cases_ = function() {
  module('Table');

  test('ABC for rows and columns', function () {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    strictEqual(Fixture.getFirstRowCoordinate(), 1);
    strictEqual(Fixture.getLastRowCoordinate(), 4);
    strictEqual(Fixture.getFirstColumnCoordinate(), 1);
    strictEqual(Fixture.getLastColumnCoordinate(), 5);
  });

  test('ABC for rows and columns with row shift', function () {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      strictEqual(Fixture.getFirstRowCoordinate(), 2);
      strictEqual(Fixture.getLastRowCoordinate(), 5);
      strictEqual(Fixture.getFirstColumnCoordinate(), 1);
      strictEqual(Fixture.getLastColumnCoordinate(), 5);
    });
  });

  test('ABC for rows and columns with column shift', function () {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      strictEqual(Fixture.getFirstRowCoordinate(), 1);
      strictEqual(Fixture.getLastRowCoordinate(), 4);
      strictEqual(Fixture.getFirstColumnCoordinate(), 2);
      strictEqual(Fixture.getLastColumnCoordinate(), 6);
    });
  });

  test('ABC for rows and columns with row & column shift', function () {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      strictEqual(Fixture.getFirstRowCoordinate(), 2);
      strictEqual(Fixture.getLastRowCoordinate(), 5);
      strictEqual(Fixture.getFirstColumnCoordinate(), 2);
      strictEqual(Fixture.getLastColumnCoordinate(), 6);
    });
  });

  test('define', function() {
    var Fixture1 = Tamotsu.Table.define({ sheetName: 'Agents' });
    strictEqual(Fixture1.sheetName, 'Agents');
    strictEqual(Fixture1.rowShift, 0);
    strictEqual(Fixture1.columnShift, 0);
    var Fixture2 = Tamotsu.Table.define({ sheetName: 'No data' });
    strictEqual(Fixture2.sheetName, 'No data');
    strictEqual(Fixture2.rowShift, 0);
    strictEqual(Fixture2.columnShift, 0);
  });

  test('define with row shift', function () {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      strictEqual(Fixture.rowShift, 1);
      strictEqual(Fixture.columnShift, 0);
      deepEqual(Fixture.columns(), ['#', 'First Name', 'Last Name', 'Gender', 'Salary']);

      var fixture = Fixture.first();
      strictEqual(fixture['#'], 1);
      strictEqual(fixture['First Name'], 'Charles');
      strictEqual(fixture['Last Name'], 'Bartowski');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 100);
      strictEqual(fixture.row_, 3);

      var fixture = Fixture.last();
      strictEqual(fixture['#'], 3);
      strictEqual(fixture['First Name'], 'John');
      strictEqual(fixture['Last Name'], 'Casey');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 200);
      strictEqual(fixture.row_, 5);
    });
  });

  test('define with column shift', function () {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      strictEqual(Fixture.rowShift, 0);
      strictEqual(Fixture.columnShift, 1);
      deepEqual(Fixture.columns(), ['#', 'First Name', 'Last Name', 'Gender', 'Salary']);

      var fixture = Fixture.first();
      strictEqual(fixture['#'], 1);
      strictEqual(fixture['First Name'], 'Charles');
      strictEqual(fixture['Last Name'], 'Bartowski');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 100);
      strictEqual(fixture.row_, 2);

      var fixture = Fixture.last();
      strictEqual(fixture['#'], 3);
      strictEqual(fixture['First Name'], 'John');
      strictEqual(fixture['Last Name'], 'Casey');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 200);
      strictEqual(fixture.row_, 4);
    });
  });

  test('define with row & column shift', function () {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      strictEqual(Fixture.rowShift, 1);
      strictEqual(Fixture.columnShift, 1);
      deepEqual(Fixture.columns(), ['#', 'First Name', 'Last Name', 'Gender', 'Salary']);

      var fixture = Fixture.first();
      strictEqual(fixture['#'], 1);
      strictEqual(fixture['First Name'], 'Charles');
      strictEqual(fixture['Last Name'], 'Bartowski');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 100);
      strictEqual(fixture.row_, 3);

      var fixture = Fixture.last();
      strictEqual(fixture['#'], 3);
      strictEqual(fixture['First Name'], 'John');
      strictEqual(fixture['Last Name'], 'Casey');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 200);
      strictEqual(fixture.row_, 5);
    });
  });

  test('define with class properties', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents', something: 'Something' });
    strictEqual(Fixture.something, 'Something');
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
    strictEqual(fixture.fullName(), 'Charles Bartowski');
  });

  test('define with a sheet having a column named "class"', function() {
    var Fixture = Tamotsu.Table.define({
      sheetName: 'class',
    });
    var fixture = Fixture.first();
    strictEqual(fixture['class'], '');
  });

  test('define with a sheet having non-autoincrement id', function() {
    withRollback_('String id', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName(), autoIncrement: false });
      var fixture = Fixture.create({ '#': 'ccc', 'Food': 'Tempura' });
      strictEqual(fixture['#'], 'ccc');
      strictEqual(fixture['Food'], 'Tempura');
    });
  });

  test('columns', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    deepEqual(Fixture.columns(), ['#', 'First Name', 'Last Name', 'Gender', 'Salary']);
  });

  test('columns with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      deepEqual(Fixture.columns(), ['#', 'First Name', 'Last Name', 'Gender', 'Salary']);
    });
  });

  test('columns with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      deepEqual(Fixture.columns(), ['#', 'First Name', 'Last Name', 'Gender', 'Salary']);
    });
  });

  test('columns with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      deepEqual(Fixture.columns(), ['#', 'First Name', 'Last Name', 'Gender', 'Salary']);
    });
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

  test('columnIndexOf with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      deepEqual(Fixture.columnIndexOf('Gender'), 3);
    });
  });

  test('columnIndexOf with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      deepEqual(Fixture.columnIndexOf('Gender'), 3);
    });
  });

  test('columnIndexOf with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      deepEqual(Fixture.columnIndexOf('Gender'), 3);
    });
  });

  test('columnABCFor',function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    strictEqual(Fixture.columnABCFor('First Name'), 'B');
  });

  test('columnABCFor with row shift',function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      strictEqual(Fixture.columnABCFor('First Name'), 'B');
    });
  });

  test('columnABCFor with column shift',function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      strictEqual(Fixture.columnABCFor('First Name'), 'C');
    });
  });

  test('columnABCFor with row & column shift',function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      strictEqual(Fixture.columnABCFor('First Name'), 'C');
    });
  });

  test('first', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = Fixture.first();
    strictEqual(fixture['#'], 1);
    strictEqual(fixture['First Name'], 'Charles');
    strictEqual(fixture['Last Name'], 'Bartowski');
    strictEqual(fixture['Gender'], 'Male');
    strictEqual(fixture['Salary'], 100);
    strictEqual(fixture.row_, 2);
  });

  test('first with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      var fixture = Fixture.first();
      strictEqual(fixture['#'], 1);
      strictEqual(fixture['First Name'], 'Charles');
      strictEqual(fixture['Last Name'], 'Bartowski');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 100);
      strictEqual(fixture.row_, 3);
    });
  });

  test('first with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      var fixture = Fixture.first();
      strictEqual(fixture['#'], 1);
      strictEqual(fixture['First Name'], 'Charles');
      strictEqual(fixture['Last Name'], 'Bartowski');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 100);
      strictEqual(fixture.row_, 2);
    });
  });

  test('first with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      var fixture = Fixture.first();
      strictEqual(fixture['#'], 1);
      strictEqual(fixture['First Name'], 'Charles');
      strictEqual(fixture['Last Name'], 'Bartowski');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 100);
      strictEqual(fixture.row_, 3);
    });
  });

  test('first with no records', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'No data' });
    strictEqual(Fixture.first(), null);
  });

  test('first with no records with row shift', function() {
    withRollback_('No data', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      strictEqual(Fixture.first(), null);
    });
  });

  test('first with no records with column shift', function() {
    withRollback_('No data', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      strictEqual(Fixture.first(), null);
    });
  });

  test('first with no records with row & column shift', function() {
    withRollback_('No data', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      strictEqual(Fixture.first(), null);
    });
  });

  test('last', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = Fixture.last();
    strictEqual(fixture['#'], 3);
    strictEqual(fixture['First Name'], 'John');
    strictEqual(fixture['Last Name'], 'Casey');
    strictEqual(fixture['Gender'], 'Male');
    strictEqual(fixture['Salary'], 200);
    strictEqual(fixture.row_, 4);
  });

  test('last with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      var fixture = Fixture.last();
      strictEqual(fixture['#'], 3);
      strictEqual(fixture['First Name'], 'John');
      strictEqual(fixture['Last Name'], 'Casey');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 200);
      strictEqual(fixture.row_, 5);
    });
  });

  test('last with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      var fixture = Fixture.last();
      strictEqual(fixture['#'], 3);
      strictEqual(fixture['First Name'], 'John');
      strictEqual(fixture['Last Name'], 'Casey');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 200);
      strictEqual(fixture.row_, 4);
    });
  });

  test('last with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      var fixture = Fixture.last();
      strictEqual(fixture['#'], 3);
      strictEqual(fixture['First Name'], 'John');
      strictEqual(fixture['Last Name'], 'Casey');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 200);
      strictEqual(fixture.row_, 5);
    });
  });

  test('last with no records', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'No data' });
    strictEqual(Fixture.last(), null);
  });

  test('last with no records with row shift', function() {
    withRollback_('No data', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      strictEqual(Fixture.last(), null);
    });
  });

  test('last with no records with column shift', function() {
    withRollback_('No data', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      strictEqual(Fixture.last(), null);
    });
  });

  test('last with no records with row & column shift', function() {
    withRollback_('No data', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      strictEqual(Fixture.last(), null);
    });
  });

  test('find', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = Fixture.find(2);
    strictEqual(fixture['#'], 2);
    strictEqual(fixture['First Name'], 'Sarah');
    strictEqual(fixture['Last Name'], 'Walker');
    strictEqual(fixture['Gender'], 'Female');
    strictEqual(fixture['Salary'], 300);
    strictEqual(fixture.row_, 3);
  });

  test('find with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      var fixture = Fixture.find(2);
      strictEqual(fixture['#'], 2);
      strictEqual(fixture['First Name'], 'Sarah');
      strictEqual(fixture['Last Name'], 'Walker');
      strictEqual(fixture['Gender'], 'Female');
      strictEqual(fixture['Salary'], 300);
      strictEqual(fixture.row_, 4);
    });
  });

  test('find with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      var fixture = Fixture.find(2);
      strictEqual(fixture['#'], 2);
      strictEqual(fixture['First Name'], 'Sarah');
      strictEqual(fixture['Last Name'], 'Walker');
      strictEqual(fixture['Gender'], 'Female');
      strictEqual(fixture['Salary'], 300);
      strictEqual(fixture.row_, 3);
    });
  });

  test('find with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      var fixture = Fixture.find(2);
      strictEqual(fixture['#'], 2);
      strictEqual(fixture['First Name'], 'Sarah');
      strictEqual(fixture['Last Name'], 'Walker');
      strictEqual(fixture['Gender'], 'Female');
      strictEqual(fixture['Salary'], 300);
      strictEqual(fixture.row_, 4);
    });
  });

  test('find by invalid id', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    try {
      var fixture = Fixture.find(999);
      strictEqual(1, 2); // for failure
    } catch (e) {
      strictEqual(e, 'Record not found [id=999]');
    }
  });

  test('find by invalid id with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      try {
        var fixture = Fixture.find(999);
        strictEqual(1, 2); // for failure
      } catch (e) {
        strictEqual(e, 'Record not found [id=999]');
      }
    });
  });

  test('find by invalid id with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      try {
        var fixture = Fixture.find(999);
        strictEqual(1, 2); // for failure
      } catch (e) {
        strictEqual(e, 'Record not found [id=999]');
      }
    });
  });

  test('find by invalid id with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      try {
        var fixture = Fixture.find(999);
        strictEqual(1, 2); // for failure
      } catch (e) {
        strictEqual(e, 'Record not found [id=999]');
      }
    });
  });

  test('find by not "#" column', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Other id', idColumn: 'id' });
    strictEqual(Fixture.find(3)['country'], 'U.K.');
  });

  test('find by not "#" column with row shift', function() {
    withRollback_('Other id', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0, {idColumn: 'id'});
      strictEqual(Fixture.find(3)['country'], 'U.K.');
    });
  });

  test('find by not "#" column with column shift', function() {
    withRollback_('Other id', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1, {idColumn: 'id'});
      strictEqual(Fixture.find(3)['country'], 'U.K.');
    });
  });

  test('find by not "#" column with row & column shift', function() {
    withRollback_('Other id', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1, {idColumn: 'id'});
      strictEqual(Fixture.find(3)['country'], 'U.K.');
    });
  });

  test('find by string id', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'String id' });
    strictEqual(Fixture.find('aaa')['Food'], 'Sushi');
  });

  test('find by string id with row shift', function() {
    withRollback_('String id', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      strictEqual(Fixture.find('aaa')['Food'], 'Sushi');
    });
  });

  test('find by string id with column shift', function() {
    withRollback_('String id', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      strictEqual(Fixture.find('aaa')['Food'], 'Sushi');
    });
  });

  test('find by string id with row & column shift', function() {
    withRollback_('String id', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      strictEqual(Fixture.find('aaa')['Food'], 'Sushi');
    });
  });

  test('all', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    Fixture.all().forEach(function(record, i) {
      strictEqual(record['#'], i + 1);
      strictEqual(record.row_, i + 2);
    });
  });

  test('all with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      Fixture.all().forEach(function (record, i) {
        strictEqual(record['#'], i + 1);
        strictEqual(record.row_, i + 2 + 1);
      });
    });
  });

  test('all with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      Fixture.all().forEach(function (record, i) {
        strictEqual(record['#'], i + 1);
        strictEqual(record.row_, i + 2);
      });
    });
  });

  test('all with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      Fixture.all().forEach(function (record, i) {
        strictEqual(record['#'], i + 1);
        strictEqual(record.row_, i + 2 + 1);
      });
    });
  });

  test('pluck', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    deepEqual(Fixture.pluck('Last Name'), ['Bartowski', 'Walker', 'Casey']);
  });

  test('pluck with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      deepEqual(Fixture.pluck('Last Name'), ['Bartowski', 'Walker', 'Casey']);
    });
  });

  test('pluck with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      deepEqual(Fixture.pluck('Last Name'), ['Bartowski', 'Walker', 'Casey']);
    });
  });

  test('pluck with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      deepEqual(Fixture.pluck('Last Name'), ['Bartowski', 'Walker', 'Casey']);
    });
  });

  test('sum', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    strictEqual(Fixture.sum('Salary'), 600);
  });

  test('sum with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      strictEqual(Fixture.sum('Salary'), 600);
    });
  });

  test('sum with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      strictEqual(Fixture.sum('Salary'), 600);
    });
  });

  test('sum with & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      strictEqual(Fixture.sum('Salary'), 600);
    });
  });

  test('max', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    strictEqual(Fixture.max('Salary'), 300);
  });

  test('max with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      strictEqual(Fixture.max('Salary'), 300);
    });
  });

  test('max with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      strictEqual(Fixture.max('Salary'), 300);
    });
  });

  test('max with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      strictEqual(Fixture.max('Salary'), 300);
    });
  });

  test('min', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    strictEqual(Fixture.min('Salary'), 100);
  });

  test('min with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      strictEqual(Fixture.min('Salary'), 100);
    });
  });

  test('min with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      strictEqual(Fixture.min('Salary'), 100);
    });
  });

  test('min with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      strictEqual(Fixture.min('Salary'), 100);
    });
  });

  test('new', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = new Fixture({ 'First Name': 'Devon', 'Last Name': 'Woodcomb', 'Invalid attr': 'ignore it' });
    strictEqual(fixture['First Name'], 'Devon');
    strictEqual(fixture['Last Name'], 'Woodcomb');
    strictEqual(fixture['Gender'], undefined);
    strictEqual(fixture['Invalid attr'], undefined);
  });

  test('new with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      var fixture = new Fixture({'First Name': 'Devon', 'Last Name': 'Woodcomb', 'Invalid attr': 'ignore it'});
      strictEqual(fixture['First Name'], 'Devon');
      strictEqual(fixture['Last Name'], 'Woodcomb');
      strictEqual(fixture['Gender'], undefined);
      strictEqual(fixture['Invalid attr'], undefined);
    });
  });

  test('new with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      var fixture = new Fixture({'First Name': 'Devon', 'Last Name': 'Woodcomb', 'Invalid attr': 'ignore it'});
      strictEqual(fixture['First Name'], 'Devon');
      strictEqual(fixture['Last Name'], 'Woodcomb');
      strictEqual(fixture['Gender'], undefined);
      strictEqual(fixture['Invalid attr'], undefined);
    });
  });

  test('new with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      var fixture = new Fixture({'First Name': 'Devon', 'Last Name': 'Woodcomb', 'Invalid attr': 'ignore it'});
      strictEqual(fixture['First Name'], 'Devon');
      strictEqual(fixture['Last Name'], 'Woodcomb');
      strictEqual(fixture['Gender'], undefined);
      strictEqual(fixture['Invalid attr'], undefined);
    });
  });

  test('validate on', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture1 = Tamotsu.Table.define({ sheetName: sheet.getName() }, {
        validate: function(on) {
          strictEqual(on, 'create');
        },
      });
      Fixture1.create({});

      var Fixture2 = Tamotsu.Table.define({ sheetName: sheet.getName() }, {
        validate: function(on) {
          strictEqual(on, 'update');
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
      strictEqual(fixture.save(), false);
      strictEqual(fixture.errors['First Name'], "can't be blank");
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
      strictEqual(Fixture.create({}), false);
    });
  });

  test('validate string id presence', function() {
    withRollback_('String id', function(sheet) {
      var Fixture = Tamotsu.Table.define({
        sheetName: sheet.getName(),
        autoIncrement: false,
      });
      strictEqual(Fixture.create({ 'Food': 'Tempura' }), false);
    });
  });

  test('create', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var fixture = Fixture.create({ 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Salary': 0 });
      strictEqual(fixture.row_, 5);
      strictEqual(fixture['#'], 4);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Salary'], 0);
      var values = sheet.getRange('A5:E5').getValues()[0];
      strictEqual(values[0], 4);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], '');
      strictEqual(values[4], 0);
    });
  });

  test('create with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      var fixture = Fixture.create({ 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Salary': 0 });
      strictEqual(fixture.row_, 6);
      strictEqual(fixture['#'], 4);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Salary'], 0);
      var values = sheet.getRange('A6:E6').getValues()[0];
      strictEqual(values[0], 4);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], '');
      strictEqual(values[4], 0);
    });
  });

  test('create with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      var fixture = Fixture.create({ 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Salary': 0 });
      strictEqual(fixture.row_, 5);
      strictEqual(fixture['#'], 4);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Salary'], 0);
      var values = sheet.getRange('B5:F5').getValues()[0];
      strictEqual(values[0], 4);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], '');
      strictEqual(values[4], 0);
    });
  });

  test('create with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      var fixture = Fixture.create({ 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Salary': 0 });
      strictEqual(fixture.row_, 6);
      strictEqual(fixture['#'], 4);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Salary'], 0);
      var values = sheet.getRange('B6:F6').getValues()[0];
      strictEqual(values[0], 4);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], '');
      strictEqual(values[4], 0);
    });
  });

  test('create into empty table', function() {
    withRollback_('No data', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var fixture = Fixture.create({ 'Attr': 'Test' });
      strictEqual(fixture.row_, 2);
      var values = sheet.getRange('A2:B2').getValues()[0];
      strictEqual(values[0], 1);
      strictEqual(values[1], 'Test');
    });
  });

  test('create into empty table with row shift', function() {
    withRollback_('No data', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      var fixture = Fixture.create({ 'Attr': 'Test' });
      strictEqual(fixture.row_, 3);
      var values = sheet.getRange('A3:B3').getValues()[0];
      strictEqual(values[0], 1);
      strictEqual(values[1], 'Test');
    });
  });

  test('create into empty table with column shift', function() {
    withRollback_('No data', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      var fixture = Fixture.create({ 'Attr': 'Test' });
      strictEqual(fixture.row_, 2);
      var values = sheet.getRange('B2:C2').getValues()[0];
      strictEqual(values[0], 1);
      strictEqual(values[1], 'Test');
    });
  });

  test('create into empty table with row & column shift', function() {
    withRollback_('No data', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      var fixture = Fixture.create({ 'Attr': 'Test' });
      strictEqual(fixture.row_, 3);
      var values = sheet.getRange('B3:C3').getValues()[0];
      strictEqual(values[0], 1);
      strictEqual(values[1], 'Test');
    });
  });

  test('create with a given id value', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var fixture = Fixture.create({ '#': 0, 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 });
      strictEqual(fixture.row_, 5);
      strictEqual(fixture['#'], 0);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('A5:E5').getValues()[0];
      strictEqual(values[0], 0);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('create with a given id value with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      var fixture = Fixture.create({ '#': 0, 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 });
      strictEqual(fixture.row_, 6);
      strictEqual(fixture['#'], 0);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('A6:E6').getValues()[0];
      strictEqual(values[0], 0);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('create with a given id value with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      var fixture = Fixture.create({ '#': 0, 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 });
      strictEqual(fixture.row_, 5);
      strictEqual(fixture['#'], 0);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('B5:F5').getValues()[0];
      strictEqual(values[0], 0);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('create with a given id value with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      var fixture = Fixture.create({ '#': 0, 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 });
      strictEqual(fixture.row_, 6);
      strictEqual(fixture['#'], 0);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('B6:F6').getValues()[0];
      strictEqual(values[0], 0);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with a record without id', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var fixture = new Fixture({ 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 });
      strictEqual(Fixture.createOrUpdate(fixture), fixture);
      strictEqual(fixture.row_, 5);
      strictEqual(fixture['#'], 4);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('A5:E5').getValues()[0];
      strictEqual(values[0], 4);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with a record without id with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      var fixture = new Fixture({ 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 });
      strictEqual(Fixture.createOrUpdate(fixture), fixture);
      strictEqual(fixture.row_, 6);
      strictEqual(fixture['#'], 4);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('A6:E6').getValues()[0];
      strictEqual(values[0], 4);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with a record without id with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      var fixture = new Fixture({ 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 });
      strictEqual(Fixture.createOrUpdate(fixture), fixture);
      strictEqual(fixture.row_, 5);
      strictEqual(fixture['#'], 4);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('B5:F5').getValues()[0];
      strictEqual(values[0], 4);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with a record without id with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      var fixture = new Fixture({ 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 });
      strictEqual(Fixture.createOrUpdate(fixture), fixture);
      strictEqual(fixture.row_, 6);
      strictEqual(fixture['#'], 4);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('B6:F6').getValues()[0];
      strictEqual(values[0], 4);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with attributes without id', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var attributes = { 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 };
      var fixture = Fixture.createOrUpdate(attributes);
      strictEqual(fixture.row_, 5);
      strictEqual(fixture['#'], 4);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('A5:E5').getValues()[0];
      strictEqual(values[0], 4);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with attributes without id with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      var attributes = { 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 };
      var fixture = Fixture.createOrUpdate(attributes);
      strictEqual(fixture.row_, 6);
      strictEqual(fixture['#'], 4);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('A6:E6').getValues()[0];
      strictEqual(values[0], 4);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with attributes without id with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      var attributes = { 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 };
      var fixture = Fixture.createOrUpdate(attributes);
      strictEqual(fixture.row_, 5);
      strictEqual(fixture['#'], 4);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('B5:F5').getValues()[0];
      strictEqual(values[0], 4);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with attributes without id with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      var attributes = { 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 };
      var fixture = Fixture.createOrUpdate(attributes);
      strictEqual(fixture.row_, 6);
      strictEqual(fixture['#'], 4);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('B6:F6').getValues()[0];
      strictEqual(values[0], 4);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with a record with not existing id', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var fixture = new Fixture({ '#': 999, 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 });
      strictEqual(Fixture.createOrUpdate(fixture), fixture);
      strictEqual(fixture.row_, 5);
      strictEqual(fixture['#'], 999);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('A5:E5').getValues()[0];
      strictEqual(values[0], 999);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with a record with not existing id with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      var fixture = new Fixture({ '#': 999, 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 });
      strictEqual(Fixture.createOrUpdate(fixture), fixture);
      strictEqual(fixture.row_, 6);
      strictEqual(fixture['#'], 999);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('A6:E6').getValues()[0];
      strictEqual(values[0], 999);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with a record with not existing id with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      var fixture = new Fixture({ '#': 999, 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 });
      strictEqual(Fixture.createOrUpdate(fixture), fixture);
      strictEqual(fixture.row_, 5);
      strictEqual(fixture['#'], 999);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('B5:F5').getValues()[0];
      strictEqual(values[0], 999);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with a record with not existing id with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      var fixture = new Fixture({ '#': 999, 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 });
      strictEqual(Fixture.createOrUpdate(fixture), fixture);
      strictEqual(fixture.row_, 6);
      strictEqual(fixture['#'], 999);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('B6:F6').getValues()[0];
      strictEqual(values[0], 999);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with attributes with not existing id', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var attributes = { '#': 999, 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 };
      var fixture = Fixture.createOrUpdate(attributes);
      strictEqual(fixture.row_, 5);
      strictEqual(fixture['#'], 999);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('A5:E5').getValues()[0];
      strictEqual(values[0], 999);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with attributes with not existing id with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      var attributes = { '#': 999, 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 };
      var fixture = Fixture.createOrUpdate(attributes);
      strictEqual(fixture.row_, 6);
      strictEqual(fixture['#'], 999);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('A6:E6').getValues()[0];
      strictEqual(values[0], 999);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with attributes with not existing id with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      var attributes = { '#': 999, 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 };
      var fixture = Fixture.createOrUpdate(attributes);
      strictEqual(fixture.row_, 5);
      strictEqual(fixture['#'], 999);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('B5:F5').getValues()[0];
      strictEqual(values[0], 999);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with attributes with not existing id with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      var attributes = { '#': 999, 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 };
      var fixture = Fixture.createOrUpdate(attributes);
      strictEqual(fixture.row_, 6);
      strictEqual(fixture['#'], 999);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('B6:F6').getValues()[0];
      strictEqual(values[0], 999);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with a record with existing id', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var fixture = new Fixture({ '#': 1, 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 });
      strictEqual(Fixture.createOrUpdate(fixture), true);
      strictEqual(fixture.row_, 2);
      strictEqual(fixture['#'], 1);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('A2:E2').getValues()[0];
      strictEqual(values[0], 1);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with a record with existing id with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      var fixture = new Fixture({ '#': 1, 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 });
      strictEqual(Fixture.createOrUpdate(fixture), true);
      strictEqual(fixture.row_, 3);
      strictEqual(fixture['#'], 1);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('A3:E3').getValues()[0];
      strictEqual(values[0], 1);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with a record with existing id with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      var fixture = new Fixture({ '#': 1, 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 });
      strictEqual(Fixture.createOrUpdate(fixture), true);
      strictEqual(fixture.row_, 2);
      strictEqual(fixture['#'], 1);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('B2:F2').getValues()[0];
      strictEqual(values[0], 1);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with a record with existing id with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      var fixture = new Fixture({ '#': 1, 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 });
      strictEqual(Fixture.createOrUpdate(fixture), true);
      strictEqual(fixture.row_, 3);
      strictEqual(fixture['#'], 1);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('B3:F3').getValues()[0];
      strictEqual(values[0], 1);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with attributes with existing id', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var attributes = { '#': 1, 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 };
      strictEqual(Fixture.createOrUpdate(attributes), true);
      var fixture = Fixture.find(1);
      strictEqual(fixture.row_, 2);
      strictEqual(fixture['#'], 1);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('A2:E2').getValues()[0];
      strictEqual(values[0], 1);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with attributes with existing id with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      var attributes = { '#': 1, 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 };
      strictEqual(Fixture.createOrUpdate(attributes), true);
      var fixture = Fixture.find(1);
      strictEqual(fixture.row_, 3);
      strictEqual(fixture['#'], 1);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('A3:E3').getValues()[0];
      strictEqual(values[0], 1);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with attributes with existing id with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      var attributes = { '#': 1, 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 };
      strictEqual(Fixture.createOrUpdate(attributes), true);
      var fixture = Fixture.find(1);
      strictEqual(fixture.row_, 2);
      strictEqual(fixture['#'], 1);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('B2:F2').getValues()[0];
      strictEqual(values[0], 1);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('createOrUpdate with attributes with existing id with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      var attributes = { '#': 1, 'First Name': 'Morgan', 'Last Name': 'Grimes', 'Gender': 'Male', 'Salary': 50 };
      strictEqual(Fixture.createOrUpdate(attributes), true);
      var fixture = Fixture.find(1);
      strictEqual(fixture.row_, 3);
      strictEqual(fixture['#'], 1);
      strictEqual(fixture['First Name'], 'Morgan');
      strictEqual(fixture['Last Name'], 'Grimes');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 50);
      var values = sheet.getRange('B3:F3').getValues()[0];
      strictEqual(values[0], 1);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 50);
    });
  });

  test('save as create', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var fixture = new Fixture({ 'First Name': 'Morgan', 'Last Name': 'Grimes' });
      fixture.save();
      var values = sheet.getRange('A5:E5').getValues()[0];
      strictEqual(values[0], 4);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], '');
      strictEqual(values[4], '');
    });
  });

  test('save as create with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      var fixture = new Fixture({ 'First Name': 'Morgan', 'Last Name': 'Grimes' });
      fixture.save();
      var values = sheet.getRange('A6:E6').getValues()[0];
      strictEqual(values[0], 4);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], '');
      strictEqual(values[4], '');
    });
  });

  test('save as create with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      var fixture = new Fixture({ 'First Name': 'Morgan', 'Last Name': 'Grimes' });
      fixture.save();
      var values = sheet.getRange('B5:F5').getValues()[0];
      strictEqual(values[0], 4);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], '');
      strictEqual(values[4], '');
    });
  });

  test('save as create with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      var fixture = new Fixture({ 'First Name': 'Morgan', 'Last Name': 'Grimes' });
      fixture.save();
      var values = sheet.getRange('B6:F6').getValues()[0];
      strictEqual(values[0], 4);
      strictEqual(values[1], 'Morgan');
      strictEqual(values[2], 'Grimes');
      strictEqual(values[3], '');
      strictEqual(values[4], '');
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
      strictEqual(values[0], 'Devon');
      strictEqual(values[1], 'Woodcomb');
    });
  });

  test('save as update with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      var fixture = Fixture.first();
      fixture['First Name'] = 'Devon';
      fixture['Last Name'] = 'Woodcomb';
      fixture.save();
      var values = sheet.getRange('B3:C3').getValues()[0];
      strictEqual(values[0], 'Devon');
      strictEqual(values[1], 'Woodcomb');
    });
  });

  test('save as update with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      var fixture = Fixture.first();
      fixture['First Name'] = 'Devon';
      fixture['Last Name'] = 'Woodcomb';
      fixture.save();
      var values = sheet.getRange('C2:D2').getValues()[0];
      strictEqual(values[0], 'Devon');
      strictEqual(values[1], 'Woodcomb');
    });
  });

  test('save as update with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      var fixture = Fixture.first();
      fixture['First Name'] = 'Devon';
      fixture['Last Name'] = 'Woodcomb';
      fixture.save();
      var values = sheet.getRange('C3:D3').getValues()[0];
      strictEqual(values[0], 'Devon');
      strictEqual(values[1], 'Woodcomb');
    });
  });

  test('update attributes', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var fixture = Fixture.first();
      strictEqual(fixture.updateAttributes({ 'First Name': 'Chuck', 'Salary': 500 }), true);
      strictEqual(fixture['#'], 1);
      strictEqual(fixture['First Name'], 'Chuck');
      strictEqual(fixture['Last Name'], 'Bartowski');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 500);
      var values = sheet.getRange('A2:E2').getValues()[0];
      strictEqual(values[0], 1);
      strictEqual(values[1], 'Chuck');
      strictEqual(values[2], 'Bartowski');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 500);
    });
  });

  test('update attributes with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      var fixture = Fixture.first();
      strictEqual(fixture.updateAttributes({ 'First Name': 'Chuck', 'Salary': 500 }), true);
      strictEqual(fixture['#'], 1);
      strictEqual(fixture['First Name'], 'Chuck');
      strictEqual(fixture['Last Name'], 'Bartowski');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 500);
      var values = sheet.getRange('A3:E3').getValues()[0];
      strictEqual(values[0], 1);
      strictEqual(values[1], 'Chuck');
      strictEqual(values[2], 'Bartowski');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 500);
    });
  });

  test('update attributes with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      var fixture = Fixture.first();
      strictEqual(fixture.updateAttributes({ 'First Name': 'Chuck', 'Salary': 500 }), true);
      strictEqual(fixture['#'], 1);
      strictEqual(fixture['First Name'], 'Chuck');
      strictEqual(fixture['Last Name'], 'Bartowski');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 500);
      var values = sheet.getRange('B2:F2').getValues()[0];
      strictEqual(values[0], 1);
      strictEqual(values[1], 'Chuck');
      strictEqual(values[2], 'Bartowski');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 500);
    });
  });

  test('update attributes with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      var fixture = Fixture.first();
      strictEqual(fixture.updateAttributes({ 'First Name': 'Chuck', 'Salary': 500 }), true);
      strictEqual(fixture['#'], 1);
      strictEqual(fixture['First Name'], 'Chuck');
      strictEqual(fixture['Last Name'], 'Bartowski');
      strictEqual(fixture['Gender'], 'Male');
      strictEqual(fixture['Salary'], 500);
      var values = sheet.getRange('B3:F3').getValues()[0];
      strictEqual(values[0], 1);
      strictEqual(values[1], 'Chuck');
      strictEqual(values[2], 'Bartowski');
      strictEqual(values[3], 'Male');
      strictEqual(values[4], 500);
    });
  });

  test('destroy', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = Tamotsu.Table.define({ sheetName: sheet.getName() });
      var fixture = Fixture.first();
      fixture.destroy();
      fixture = Fixture.first();
      strictEqual(2, fixture['#'])
      strictEqual(fixture['First Name'], 'Sarah')
      strictEqual(fixture['Last Name'], 'Walker')
      strictEqual(fixture['Gender'], 'Female')
      strictEqual(fixture['Salary'], 300)
      strictEqual(fixture.row_, 2)
    });
  });

  test('destroy with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      var fixture = Fixture.first();
      fixture.destroy();
      fixture = Fixture.first();
      strictEqual(2, fixture['#'])
      strictEqual(fixture['First Name'], 'Sarah')
      strictEqual(fixture['Last Name'], 'Walker')
      strictEqual(fixture['Gender'], 'Female')
      strictEqual(fixture['Salary'], 300)
      strictEqual(fixture.row_, 3)
    });
  });

  test('destroy with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      var fixture = Fixture.first();
      fixture.destroy();
      fixture = Fixture.first();
      strictEqual(2, fixture['#'])
      strictEqual(fixture['First Name'], 'Sarah')
      strictEqual(fixture['Last Name'], 'Walker')
      strictEqual(fixture['Gender'], 'Female')
      strictEqual(fixture['Salary'], 300)
      strictEqual(fixture.row_, 2)
    });
  });

  test('destroy with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      var fixture = Fixture.first();
      fixture.destroy();
      fixture = Fixture.first();
      strictEqual(2, fixture['#'])
      strictEqual(fixture['First Name'], 'Sarah')
      strictEqual(fixture['Last Name'], 'Walker')
      strictEqual(fixture['Gender'], 'Female')
      strictEqual(fixture['Salary'], 300)
      strictEqual(fixture.row_, 3)
    });
  });

  test('getAttributes', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var attributes = Fixture.first().getAttributes();
    strictEqual(attributes['#'], 1);
    strictEqual(attributes['First Name'], 'Charles');
    strictEqual(attributes['Last Name'], 'Bartowski');
    strictEqual(attributes['Gender'], 'Male');
    strictEqual(attributes['Salary'], 100);
    strictEqual(attributes['row_'], undefined);
  });

  test('getAttributes with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      var attributes = Fixture.first().getAttributes();
      strictEqual(attributes['#'], 1);
      strictEqual(attributes['First Name'], 'Charles');
      strictEqual(attributes['Last Name'], 'Bartowski');
      strictEqual(attributes['Gender'], 'Male');
      strictEqual(attributes['Salary'], 100);
      strictEqual(attributes['row_'], undefined);
    });
  });

  test('getAttributes with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      var attributes = Fixture.first().getAttributes();
      strictEqual(attributes['#'], 1);
      strictEqual(attributes['First Name'], 'Charles');
      strictEqual(attributes['Last Name'], 'Bartowski');
      strictEqual(attributes['Gender'], 'Male');
      strictEqual(attributes['Salary'], 100);
      strictEqual(attributes['row_'], undefined);
    });
  });

  test('getAttributes with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      var attributes = Fixture.first().getAttributes();
      strictEqual(attributes['#'], 1);
      strictEqual(attributes['First Name'], 'Charles');
      strictEqual(attributes['Last Name'], 'Bartowski');
      strictEqual(attributes['Gender'], 'Male');
      strictEqual(attributes['Salary'], 100);
      strictEqual(attributes['row_'], undefined);
    });
  });

  test('where', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture
        .where(function(agent) { return agent['Gender'] === 'Male'; })
        .all();
    strictEqual(fixtures.length, 2);
    strictEqual(fixtures[0]['First Name'], 'Charles');
    strictEqual(fixtures[1]['First Name'], 'John');
  });

  test('where with row shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 0);
      var fixtures = Fixture
          .where(function(agent) { return agent['Gender'] === 'Male'; })
          .all();
      strictEqual(fixtures.length, 2);
      strictEqual(fixtures[0]['First Name'], 'Charles');
      strictEqual(fixtures[1]['First Name'], 'John');
    });
  });

  test('where with column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 0, 1);
      var fixtures = Fixture
          .where(function(agent) { return agent['Gender'] === 'Male'; })
          .all();
      strictEqual(fixtures.length, 2);
      strictEqual(fixtures[0]['First Name'], 'Charles');
      strictEqual(fixtures[1]['First Name'], 'John');
    });
  });

  test('where with row & column shift', function() {
    withRollback_('Agents', function(sheet) {
      var Fixture = makeShiftForSheet(sheet, 1, 1);
      var fixtures = Fixture
          .where(function(agent) { return agent['Gender'] === 'Male'; })
          .all();
      strictEqual(fixtures.length, 2);
      strictEqual(fixtures[0]['First Name'], 'Charles');
      strictEqual(fixtures[1]['First Name'], 'John');
    });
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
    strictEqual(fixtures.length, 1);
    strictEqual(fixtures[0]['First Name'], 'Charles');
  });

  test('where with object condition', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture.where({ 'Gender': 'Male', 'Last Name': 'Bartowski' }).all();
    strictEqual(fixtures.length, 1);
    strictEqual(fixtures[0]['First Name'], 'Charles');
  });

  test('where then pluck', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var genders = Fixture
        .where(function(agent) { return agent['Gender'] === 'Male'; })
        .pluck('Gender');
    strictEqual(genders.length, 2);
    deepEqual(genders, ['Male', 'Male']);
  });

  test('where then sum', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var total = Fixture
        .where(function(agent) { return agent['Gender'] === 'Male'; })
        .sum('Salary');
    strictEqual(total, 300);
  });

  test('where then max', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var total = Fixture
        .where(function(agent) { return agent['Gender'] === 'Male'; })
        .max('Salary');
    strictEqual(total, 200);
  });

  test('where then min', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var total = Fixture
        .where(function(agent) { return agent['Gender'] === 'Male'; })
        .min('Salary');
    strictEqual(total, 100);
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
      strictEqual(values[0], 'Eleanor');
      strictEqual(values[1], 'Bartowski');
    });
  });

  test('where then get first', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = Fixture
        .where(function(agent) { return agent['Gender'] === 'Male'; })
        .first();
    strictEqual(fixture['First Name'], 'Charles');
  });

  test('where then get last', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixture = Fixture
        .where(function(agent) { return agent['Gender'] === 'Male'; })
        .last();
    strictEqual(fixture['First Name'], 'John');
  });

  test('order', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture
        .order(function(t1, t2) { return t1['Salary'] < t2['Salary'] ? -1 : 1; })
        .all();
    strictEqual(3, fixtures.length);
    strictEqual(fixtures[0]['First Name'], 'Charles');
    strictEqual(fixtures[1]['First Name'], 'John');
    strictEqual(fixtures[2]['First Name'], 'Sarah');
  });

  test('order with string comparator as asc', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture.order('Salary').all();
    strictEqual(3, fixtures.length);
    strictEqual(fixtures[0]['First Name'], 'Charles');
    strictEqual(fixtures[1]['First Name'], 'John');
    strictEqual(fixtures[2]['First Name'], 'Sarah');
  });

  test('order with string comparator as desc', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture.order('First Name DESC').all();
    strictEqual(3, fixtures.length);
    strictEqual(fixtures[0]['First Name'], 'Sarah');
    strictEqual(fixtures[1]['First Name'], 'John');
    strictEqual(fixtures[2]['First Name'], 'Charles');
  });
  
  test('order with string comparator as combined', function() {
    var Fixture = Tamotsu.Table.define({ sheetName: 'Agents' });
    var fixtures = Fixture.order('Gender desc, Salary DESC').all();
    strictEqual(3, fixtures.length);
    strictEqual(fixtures[0]['First Name'], 'John');
    strictEqual(fixtures[1]['First Name'], 'Charles');
    strictEqual(fixtures[2]['First Name'], 'Sarah');
  });
};