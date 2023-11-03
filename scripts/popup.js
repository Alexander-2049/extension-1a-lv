const WORKER = "https://data-parser-1a-lv.a-alexander-2049.workers.dev/?url=";

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

getCurrentTab().then((tab) => {
    const url = tab.url;
    document.querySelector("h1").innerText = url;

    const pattern = /^https:\/\/www\.1a\.lv\/p\/[^/]+\/[^/]+$/;
    const pattern2 = /^https:\/\/www\.1a\.lv\/ru\/p\/[^/]+\/[^/]+$/;
    if(!pattern.test(url) && !pattern2.test(url)) {
        return new Error("wrong url");
    }

    fetch(WORKER + tab.url)
    .then(response => {
        return response.json();
    })
    .then(json => {
        const list = document.querySelector("#list");
        const ul = document.createElement("ul");
        json.reverse();
        for(let i = 0; i < json.length; i++) {
            const element = json[i];
            const li = document.createElement("li");
            
            const isNextElement = json[i+1] ? true : false;
            let difference = "";
            if(isNextElement) {
                difference = Math.round((element.price - json[i+1].price) * 100) / 100;
                if(difference > 0) {
                    difference = `(+${difference} EUR)`;
                } else if(difference < 0) {
                    difference = `(${difference} EUR)`;
                } if(difference === 0) {
                    difference = "";
                }
            }

            li.textContent = element.timestamp + " " + element.price + " " + "EUR" + difference;
            ul.appendChild(li);
        }
        list.appendChild(ul);
    })

})