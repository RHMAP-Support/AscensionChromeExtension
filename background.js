chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          // Enable button only for those urls that are CSP or salesforce
        // regex is    .na7.visual.force.com.|access.redhat.com(?!.*ascension).*$

          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'visual.force.com/apex/Case_View' }
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains : 'access.redhat.com/support/cases/' }
          })

        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});


chrome.pageAction.onClicked.addListener(function(tab) {
  var submitUrl = 'https://support-x76j4x2x53ke2uhog35i7g23-live.mbaas2.eu.feedhenry.com/ascension?query=' + tab.url.replace('&', '%26')
  submitUrl = submitUrl.replace('#/', '');
  console.log(submitUrl);

  var req = new XMLHttpRequest();
  req.open('GET', submitUrl);

  req.onload = function() {
    // Parse and process the response.
    var response = JSON.parse(req.response);

    // Create tab based on the returned url.
    chrome.tabs.create( {'url': response.url, 'active': true});

    window.close();
  }
  req.onerror = function() {
    errorCallback('Network error.');
  };
  
  req.send();

});