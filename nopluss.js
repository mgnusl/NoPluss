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
let removedArticles = 0;

isDisabled().then(
    res => {
        if (!res) runNoPluss();
    },
    err => {
        // If we cannot get user settings, run anyway
        runNoPluss();
    }
);

function runNoPluss() {
    if (isAdressa()) {
        totalArticles = document.querySelectorAll(".article").length;
        const plusArticleContainers = document.querySelectorAll(".payed");
        plusArticleContainers.forEach(item => {
            if (item.childElementCount === 1) {
                item.parentNode.removeChild(item);
                removedArticles++;
            } else {
                const spans = item.querySelectorAll("h3.headline > span");
                const anchorsInsideSpans = item.querySelectorAll("h3.headline > span > a");
                spans.forEach(span => {
                    if (
                        window.getComputedStyle(span, ":after").getPropertyValue("color") ===
                        "rgb(40, 170, 226)"
                    ) {
                        const article = span.closest(".article");
                        article.parentNode.removeChild(article);
                        removedArticles++;
                    }
                });
                anchorsInsideSpans.forEach(anchor => {
                    if (
                        window.getComputedStyle(anchor, ":after").getPropertyValue("color") ===
                        "rgb(40, 170, 226)"
                    ) {
                        const article = anchor.closest(".article");
                        article.parentNode.removeChild(article);
                        removedArticles++;
                    }
                });
            }
        });

        updateStats();
    } else if (isVg()) {
        totalArticles = document.querySelectorAll(".article-content").length;
        plusArticles = document.querySelectorAll(".df-img-skin-pluss.df-img-container");

        plusArticles.forEach(item => {
            const article = item.closest(".article-extract");
            article.parentNode.removeChild(article);
        });
        removedArticles = plusArticles.length;
        updateStats();
    } else if (isDb()) {
        totalArticles = document.querySelectorAll("article[id^='article']").length;
        plusArticles = document.querySelectorAll("article[data-label='pluss']");

        plusArticles.forEach(item => {
            item.parentNode.removeChild(item);
        });
        removedArticles = plusArticles.length;
        updateStats();
    } else if (isDn()) {
        totalArticles = document.querySelectorAll(".df-article").length;
        plusArticles = document.querySelectorAll(".df-skin-paid");

        plusArticles.forEach(item => {
            item.parentNode.removeChild(item);
        });
        removedArticles = plusArticles.length;
        updateStats();
    } else if (isAmedia()) {
        // Amedia articles are loaded async, so we do interval check before manipulating DOM
        var promise = new Promise((resolve, reject) => {
            const checkExist = setInterval(() => {
                if (document.querySelectorAll("amedia-frontpage #front0").length) {
                    clearInterval(checkExist);
                    resolve();
                }
            }, 100);
        });

        promise.then(() => {
            totalArticles = document.querySelectorAll("optimus-element").length;
            plusArticles = document.querySelectorAll(".premium-logo");

            plusArticles.forEach(item => {
                const article = item.closest("optimus-element");
                article.parentNode.removeChild(article);
            });
            removedArticles = plusArticles.length;
            updateStats();
        });
    } else if (isAp()) {
        totalArticles = document.querySelectorAll(".df-article").length;
        const all = document.querySelectorAll(".df-img-container-inner");
        all.forEach(item => {
            if (
                window.getComputedStyle(item, ":before").getPropertyValue("content") ===
                '"For abonnenter"'
            ) {
                const article = item.closest(".df-article");
                article.parentNode.removeChild(article);
                removedArticles++;
            }
        });
        updateStats();
    } else if (isNettavisen()) {
        console.log("na");
        totalArticles = document.querySelectorAll(".df-article").length;
        plusArticles = document.querySelectorAll(".df-skin-napluss");
        plusArticles.forEach(item => {
            const article = item.closest(".df-article");
            article.parentNode.removeChild(article);
            removedArticles++;
        });
        updateStats();
    } else if (isBt()) {
        totalArticles = document.querySelectorAll(".df-article").length;
        const all = document.querySelectorAll(".df-article-footer-inner");
        all.forEach(item => {
            if (
                window.getComputedStyle(item, ":before").getPropertyValue("content") ===
                '"Abonnent"'
            ) {
                const article = item.closest(".df-article");
                article.parentNode.removeChild(article);
                removedArticles++;
            }
        });
        updateStats();
    }
}

function updateStats() {
    if (totalArticles && removedArticles) {
        chrome.storage.sync.get("totalRemoved", data => {
            chrome.storage.sync.set({
                totalRemoved: data.totalRemoved + removedArticles,
                currentPageRemoved: removedArticles,
                currentPageTotalArticles: totalArticles,
                currentPageUrl: currentUrl.replace("www.", "")
            });
        });
    } else {
        chrome.storage.sync.set({
            currentPageRemoved: 0,
            currentPageTotalArticles: 0
        });
    }
}

function isDisabled() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get("disabledDomains", data => {
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

function isAp() {
    return currentUrl.includes("aftenposten.no");
}

function isNettavisen() {
    return currentUrl.includes("nettavisen.no");
}

function isBt() {
    return currentUrl.includes("bt.no");
}

// Make popup available
chrome.runtime.sendMessage({
    from: "contentScript",
    subject: "showPageAction"
});
