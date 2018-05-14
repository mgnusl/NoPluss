const totalRemoved = document.getElementById("removed");
const currentPageRemoved = document.getElementById("currentpage-removed");
const currentPageArticles = document.getElementById("currentpage-articles");
const currentPageUrl = document.getElementById("currentpage-url");
const currentPageRemovedPercentage = document.getElementById("percentage");

document.getElementById("options").addEventListener("click", function() {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL("options.html"));
    }
});

chrome.storage.sync.get("totalRemoved", function(data) {
    totalRemoved.textContent = data.totalRemoved;
});

chrome.storage.sync.get(
    ["currentPageRemoved", "currentPageTotalArticles", "currentPageUrl"],
    function(data) {
        currentPageRemoved.textContent = data.currentPageRemoved;
        currentPageArticles.textContent = data.currentPageTotalArticles;
        currentPageUrl.textContent = data.currentPageUrl;

        if (data.currentPageRemoved > 0) {
            currentPageRemovedPercentage.textContent =
                Math.round(data.currentPageRemoved / data.currentPageTotalArticles * 100) + "%";
        } else {
            currentPageRemovedPercentage.textContent = "-";
        }
    }
);
