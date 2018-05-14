const availableDomains = [
    "aasavis.no",
    "adressa.no",
    "amta.no",
    "an.no",
    "auraavis.no",
    "austagderblad.no",
    "bygdeposten.no",
    "budstikka.no",
    "db.no",
    "dt.no",
    "dn.no",
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
    "vestbyavis.no",
    "vg.no"
];

const ul = document.getElementById("domains");

let disabledDomains;
const promise = new Promise((resolve, reject) => {
    chrome.storage.sync.get("disabledDomains", data => {
        disabledDomains = data.disabledDomains;
        resolve();
    });
});

promise.then(() => {
    availableDomains.forEach(domain => {
        const li = document.createElement("li");
        const label = document.createElement("label");
        label.innerHTML = domain;
        label.setAttribute("for", domain);
        const input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.setAttribute("id", domain);

        if (disabledDomains) {
            if(isDisabled(domain)) {
                input.setAttribute("checked", false);
            }
        }

        li.appendChild(input);
        li.appendChild(label);
        ul.appendChild(li);
    });
});

function isDisabled(domain) {
    return disabledDomains.some(item => {
        return domain === item;
    });
}

function saveOptions() {
    const checkboxes = document.querySelectorAll("ul#domains > li > input");
    let disabledDomains = [];
    for (let i = 0; i < checkboxes.length; i++) {
        if(checkboxes[i].checked) {
            disabledDomains.push(checkboxes[i].id);
        }
    }

    chrome.storage.sync.set(
        {
            disabledDomains: disabledDomains
        },
        function() {
            const status = document.getElementById("status");
            status.textContent = "Options saved.";
            setTimeout(() => {
                status.textContent = "";
            }, 2000);
        }
    );
}

document.getElementById("save").addEventListener("click", saveOptions);