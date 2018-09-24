// A simple Google-spreadsheet-based event logging framework.
//
// This is currently set up to log the time elapsed to find a menu item
//
// $(element).trigger('log', ['myevent', {key1: val1, key2: val2}]);

var ENABLE_NETWORK_LOGGING = true; // Controls network logging.
var ENABLE_CONSOLE_LOGGING = false; // Controls console logging.
var LOG_VERSION = 'A';             // Labels every entry with version: "A".

// These event types are intercepted for logging before jQuery handlers.
var EVENT_TYPES_TO_LOG = {
  timeEvent: true
};

// These event properties are copied to the log if present.
var EVENT_PROPERTIES_TO_LOG = {
  which: true
};

// This function is called to record some global state on each event.
var GLOBAL_STATE_TO_LOG = function() {
  return {
  };
};

(function() {

// A persistent unique id for the user.
var uid = getUniqueId();

// Hooks up all the event listeners.
function hookEventsToLog() {
  // Set up low-level event capturing.  This intercepts all
  // native events before they bubble, so we log the state
  // *before* normal event processing.
  for (var event_type in EVENT_TYPES_TO_LOG) {
    document.addEventListener(event_type, logEvent, true);
  }

  // Once the page is loaded, show our own unique id.
  $(function() {
    console.log('Your unique id is', uid);
  });

  // Listen to 'log' events which are triggered anywhere in the document.
  $(document).on('log', logEvent);
}

// Parse user agent string by looking for recognized substring.
function findFirstString(str, choices) {
  for (var j = 0; j < choices.length; j++) {
    if (str.indexOf(choices[j]) >= 0) {
      return choices[j];
    }
  }
  return '?';
}

// Genrates or remembers a somewhat-unique ID with distilled user-agent info.
function getUniqueId() {
  if (!('uid' in localStorage)) {
    var browser = findFirstString(navigator.userAgent, [
      'Seamonkey', 'Firefox', 'Chromium', 'Chrome', 'Safari', 'OPR', 'Opera',
      'Edge', 'MSIE', 'Blink', 'Webkit', 'Gecko', 'Trident', 'Mozilla']);
    var os = findFirstString(navigator.userAgent, [
      'Android', 'iOS', 'Symbian', 'Blackberry', 'Windows Phone', 'Windows',
      'OS X', 'Linux', 'iOS', 'CrOS']).replace(/ /g, '_');
    var unique = ('' + Math.random()).substr(2);
    localStorage['uid'] = os + '-' + browser + '-' + unique;
  }
  return localStorage['uid'];
}

// Log the given event.
function logEvent(event, customName, customInfo) {
  var time = (new Date).getTime();
  var name = customName || event.type;
  // By default, monitor some global state on every event.
  var infoObj = GLOBAL_STATE_TO_LOG();
  // And monitor a few interesting fields from the event, if present.
  for (var key in EVENT_PROPERTIES_TO_LOG) {
    if (key in event) {
      console.log("EVENT_PROPERTIES_TO_LOG logged");
      infoObj[key] = event[key];
    }
  }
  // Let a custom event add fields to the info.
  if (customInfo) {
    $.extend(infoObj, customInfo);
  }
  var info = JSON.stringify(infoObj);

  if (ENABLE_CONSOLE_LOGGING) {
    console.log("Console logging OK");
    console.log(uid, time, name, info, LOG_VERSION);
  }
  if (ENABLE_NETWORK_LOGGING) {
    console.log("Network logging OK");
    console.log(uid, time, name, info, LOG_VERSION);
    sendNetworkLog(uid, time, name, info, LOG_VERSION);
  }
}

// OK, go.
if (ENABLE_NETWORK_LOGGING) {
  hookEventsToLog();
}

})();

/////////////////////////////////////////////////////////////////////////////
// CS279 HW2 Kiwi Log submission function
// submits to the google form at this URL:
// docs.google.com/forms/d/e/1FAIpQLSfWLaxSPX3k9QqQ1j4mtiHHmMdb94ZjNvshEsQuCwZP5Urj6Q/viewform
function sendNetworkLog(
    uid,
    timestamp,
    label,
    data) {
  var formid = "e/1FAIpQLSfWLaxSPX3k9QqQ1j4mtiHHmMdb94ZjNvshEsQuCwZP5Urj6Q";
  var data = {
    "entry.225068172": uid,
    "entry.1321727508": timestamp,
    "entry.124509316": label,
    "entry.1063891842": data
  };
  var params = [];
  for (key in data) {
    params.push(key + "=" + encodeURIComponent(data[key]));
  }
  // Submit the form using an image to avoid CORS warnings.
  (new Image).src = "https://docs.google.com/forms/d/" + formid +
     "/formResponse?" + params.join("&");
}



//The following code is the edit googleforms.py I used to generate my function
/*# Google form submit-maker.
#
# Usage: python googlesender.py https://docs.google.com/forms/d/e/1.../viewform
#
# Point this python file at a live Google forms URL, and it will generate
# code for a Javascript function that submits to that form cross-domain.
#
# Notes:
# - The form should be created with "short answer text" questions.
# - The viewform URL to scrape is the link shared when the form is sent.
try:
    import urllib.request as urllib2
except ImportError:
    import urllib2
import re, json, sys

def idfromurl(url):
    m = re.match('https?://docs.google.com/forms/d/e/(.{16}[^/]*)/viewform', url)
    return m and m.group(1)

# Scrape the Google Form.
html = urllib2.urlopen('https://docs.google.com/forms/d/e/1FAIpQLSfFA_WyDrtfu-hR1ltBUc9vTiWaidddbfuLi547ml_FIjXq9Q/viewform').read()

# If it is a form authoring URL, then it contains a form submission url.
match = re.search(r'<meta itemprop="url" content="([^"]*)"', html)
if match and idfromurl(match.group(1)) != idfromurl('https://docs.google.com/forms/d/e/1FAIpQLSfFA_WyDrtfu-hR1ltBUc9vTiWaidddbfuLi547ml_FIjXq9Q/viewform'):
    # So fetch that page instead.
    html = urllib2.urlopen(match.group(1)).read()

# Extract this special variable value.
match = re.search(
    r'FB_PUBLIC_LOAD_DATA_\s*=\s*(.*?);\s*</script>', html, re.DOTALL)

compressed = match.group(1)

# Fix up JSON-like by replacing ,, with , null,
jstext = re.sub(r'(?<=[,[])\s*,', 'null,', compressed)

# Decode JSON.
js = json.loads(jstext)

# Sometimes the imporant data is the whole array; other times it is
# wrapped as an array inside the first element.
if isinstance(js[0] ,list):
    js = js[0]

# Camel casing, for code generation.
def camel(n):
    names = re.sub(r'\W', ' ', n).split(' ')
    cameled = [names[0].lower()] + [n.title() for n in names[1:]]
    return ''.join(cameled)

# Extract form information from the JSON.
# Tested on 3/29/2016; revised on 1/27/2017 for updated format.
formid = js[14] or js[0]
formname = js[3] or js[1][0]
fname = camel('send ' + formname)
data = js[1][1]
args = [camel(d[1]) for d in data]
nums = [d[4][0][0] for d in data]

# Code generation.
print ('// ' + formname + ' submission function')
print ('// submits to the google form at this URL:')
print ('// ' + re.sub('^https?://', '', 'https://docs.google.com/forms/d/e/1FAIpQLSfFA_WyDrtfu-hR1ltBUc9vTiWaidddbfuLi547ml_FIjXq9Q/viewform'))
print ('function ' + fname + '(\n    ' + ',\n    '.join(args) + ') {')
print ('  var formid = "' + formid + '";')
print ('  var data = {')
for j in range(len(data)):
    comma = (j + 1 < len(data) and ',' or '')
    print ('    "entry.' + str(nums[j]) + '": ' + args[j] + comma)
print ('  };')
print ('  var params = [];')
print ('  for (key in data) {')
print ('    params.push(key + "=" + encodeURIComponent(data[key]));')
print ('  }')
print ('  // Submit the form using an image to avoid CORS warnings.')
print ('  (new Image).src = "https://docs.google.com/forms/d/" + formid +')
print ('     "/formResponse?" + params.join("&");')
print ('}')
*/
