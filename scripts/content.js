// const WORKER = "https://data-parser-1a-lv.a-alexander-2049.workers.dev/?url=";
const WORKER = "https://data-parser-1a-lv.a-alexander-2049.workers.dev";
// fetch(WORKER + window.location.href)

let data;
const queryScript = document.querySelector('script[type="application/ld+json"]');
if(queryScript !== null) {
    data = JSON.parse(queryScript.innerHTML);
} else {
    const preces_kods = document.querySelector("p.product-id").innerText;
    const arr = preces_kods.split(' ');
    const id = arr[arr.length - 1];
    data = { url: window.location.href, sku: id }
}
const { url, sku: id } = data;

const request_url = `${WORKER}?url=${url}&id=${id}`;
fetch(request_url)
.then(response => {
    return response.json();
})
.then(json => {
    const difference = getDifference(json);
    if(difference === 0) return;
    const color = difference > 0 ? 'red' : 'green';
    const s_difference = stringDifference(difference);

    const div = document.createElement("div");
    div.style = "display: inline-block;";
    const span = document.createElement("span");
    span.textContent = `(${s_difference} €)`;
    span.style = `font-size: 24px; font-weight: 700; color: ${color};`;
    div.appendChild(span);
    document.querySelector(".product-price-details__block")
    .appendChild(div);
})

function getDifference(history) {
    if(history.length <= 1) {
        return 0;
    }
    history = JSON.parse(JSON.stringify(history));
    history.reverse();
    for(let i = 1; i < history.length; i++) {
        if(history[i].price !== history[0].price) {
            return history[0].price - history[i].price;
        }
    }
    return 0;
}

function stringDifference(difference) {
    // Round the difference to two decimal places
    let roundedDifference = Math.round(difference * 100) / 100;
    
    // Check if the difference is positive, negative, or zero
    if (roundedDifference > 0) {
        // If positive, add a plus sign
        return `+${roundedDifference.toFixed(2).replace(".", ",")}`;
    } else {
        // If negative or zero, no need for a plus sign
        return `${roundedDifference.toFixed(2).replace(".", ",")}`;
    }
}