QUnit.helpers(this);
var ss_ = SpreadsheetApp.getActive();
Tamotsu.onInitialized(function(ss) {
  Logger.log('passed1');
});
Tamotsu.onInitialized(function(ss) {
  Logger.log('passed2');
});

function doGet(e) {
  Tamotsu.initialize(ss_);
  
  QUnit.urlParams(e.parameter);
  QUnit.config({ title: 'Unit tests for Tamotsu' });
  QUnit.load(cases_);
  return QUnit.getHtml();
};

function withRollback_(sheetName, specFunc) {
  var source = ss_.getSheetByName(sheetName);
  var copied = source.copyTo(ss_);
  source.setName(sheetName + '_BackUpBySpecRunner');
  copied.setName(sheetName);
  try {
    specFunc(copied);
  } finally {
    ss_.deleteSheet(copied);
    source.setName(sheetName);
  }
}
