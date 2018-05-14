const amediaUrls = [
    "aasavis.no",
    "amta.no",
    "an.no",
    "auraavis.no",
    "austagderblad.no",
    "bygdeposten.no",
    "budstikka.no",
    "dt.no",
    "eikerbladet.no",
    "enebakkavis.no",
    "f-b.no",
    "finnmarksposten.no",
    "firda.no",
    "firdaposten.no",
    "fremover.no",
    "gjengangeren.no",
    "glomdalen.no",
    "h-avis.no",
    "ha-halden.no",
    "hadeland.no",
    "hardanger-folkeblad.no",
    "helg.no",
    "ifinnmark.no",
    "indre.no",
    "jarlsbergavis.no",
    "kv.no",
    "kvinnheringen.no",
    "lierposten.no",
    "lofot-tidende.no",
    "lofotposten.no",
    "laagendalsposten.no",
    "moss-avis.no",
    "noblad.no",
    "nordhordland.no",
    "nordlys.no",
    "oa.no",
    "op.no",
    "ostlendingen.no",
    "oyene.no",
    "pd.no",
    "r-a.no",
    "rablad.no",
    "ranablad.no",
    "rb.no",
    "retten.no",
    "rha.no",
    "ringblad.no",
    "ringsaker-blad.no",
    "sa.no",
    "sandeavis.no",
    "smaalenene.no",
    "ta.no",
    "tb.no",
    "telen.no",
    "tk.no",
    "tvedestrandsposten.no",
    "varingen.no",
    "vestbyavis.no"
];

const currentUrl = window.location.host;
let plusArticles; // Holds NodeList of articles to be removed from page
let totalArticles; // Holds total number of articles on page

isDisabled().then(
    res => {
        if(!res) runNoPluss();
    },
    err => {
        // If we cannot get user settings, run anyway
        runNoPluss();
    }
);

function runNoPluss() {
    if (isAmedia()) {
        // Amedia articles are loaded async, so we do interval check before manipulating DOM
        var promise = new Promise(function(resolve, reject) {
            const checkExist = setInterval(function() {
                if (document.querySelectorAll("amedia-frontpage #front0").length) {
                    clearInterval(checkExist);
                    resolve();
                }
            }, 100);
        });

        promise.then(function() {
            totalArticles = document.querySelectorAll("optimus-element").length;
            plusArticles = document.querySelectorAll(".premium-logo");

            plusArticles.forEach(function(item) {
                const article = item.closest("optimus-element");
                article.parentNode.removeChild(article);
            });
            updateStats();
        });
    } else if (isVg()) {
        totalArticles = document.querySelectorAll(".article-content").length;
        plusArticles = document.querySelectorAll(".df-img-skin-pluss.df-img-container");

        plusArticles.forEach(function(item) {
            const article = item.closest(".article-extract");
            article.parentNode.removeChild(article);
        });
        updateStats();
    } else if (isDb()) {
        totalArticles = document.querySelectorAll("article[id^='article']").length;
        plusArticles = document.querySelectorAll("article[data-label='pluss']");

        plusArticles.forEach(function(item) {
            item.parentNode.removeChild(item);
        });
        updateStats();
    } else if (isDn()) {
        totalArticles = document.querySelectorAll(".df-article").length;
        plusArticles = document.querySelectorAll(".df-skin-paid");

        plusArticles.forEach(function(item) {
            item.parentNode.removeChild(item);
        });
        updateStats();
    } else if (isAdressa()) {
        // const totalArticles = document.querySelectorAll("article[id^='article']");
        // const plusArticleContainers = document.querySelectorAll(".payed");
        // plusArticleContainers.forEach(function(item) {
        //     if (item.childElementCount === 1) {
        //         item.parentNode.removeChild(item);
        //     } else {
        //         const spans = document.querySelectorAll("h3.headline > span");
        //         console.log(spans.length);
        //         spans.forEach(function(span) {
        //             // console.log(span)
        //         });
        //         // var color = window
        //         //     .getComputedStyle(document.querySelector("span"), ":after")
        //         //     .getPropertyValue("font-weight");
        //         // console.log(color);
        //     }
        // });
        // updateStats();
    }
}

function updateStats() {
    if (totalArticles && plusArticles.length) {
        console.log("update stats");
        chrome.storage.sync.get("totalRemoved", function(data) {
            chrome.storage.sync.set({
                totalRemoved: data.totalRemoved + plusArticles.length,
                currentPageRemoved: plusArticles.length,
                currentPageTotalArticles: totalArticles,
                currentPageUrl: currentUrl
            });
        });
    }
}

function isDisabled() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get("disabledDomains", function(data) {
            if (chrome.runtime.lastError) {
                reject("An error occured");
            }
            const currentUrlNoWww = currentUrl.replace("www.", "");
            const domainIsDisabled = data.disabledDomains.some(url => {
                return url === currentUrlNoWww;
            });
            if (domainIsDisabled) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

function isAmedia() {
    return amediaUrls.some(url => {
        return currentUrl.indexOf(url) > -1;
    });
}

function isVg() {
    return currentUrl.includes("vg.no");
}

function isDb() {
    return currentUrl.includes("dagbladet.no");
}

function isDn() {
    return currentUrl.includes("dn.no");
}

function isAdressa() {
    return currentUrl.includes("adressa.no");
}

// Make popup available
chrome.runtime.sendMessage({
    from: "contentScript",
    subject: "showPageAction"
});
