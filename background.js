chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({
        settings: {},
        totalRemoved: 0,
        currentPageRemoved: 0,
        currentPageTotalArticles: 0,
        currentPageUrl: null,
        disabledDomains: []
    }, function () {
        console.log("NOPLUSS LOADED");
    });
});

chrome.runtime.onMessage.addListener(function (msg, sender) {
    // First, validate the message's structure
    if ((msg.from === 'contentScript') && (msg.subject === 'showPageAction')) {
      // Enable the page-action for the requesting tab
      chrome.pageAction.show(sender.tab.id);
    }
});