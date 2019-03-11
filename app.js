let compPrices = [];
compPrices.push(['Companies', 'Price']);
let companies = 1;
let arr2 = [];
let arr1 = [];
let comp = [];
let dataset = 0;

google.charts.load('current', {
    packages: ['corechart', 'bar']
});

function httpGet(theapiUrl) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theapiUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function getapiUrl(inputVal){
    const prefix = 'https://api.iextrading.com/1.0/stock/';
    const suffix = '/price';
    return prefix.concat(inputVal, suffix);
}

function refresh() {

    for (let i = 1; i < companies; i++) {

        arr1 = compPrices[i];
        const apiUrl = getapiUrl(arr1[0]);
        let dat = httpGet(apiUrl);
        arr2.push(arr1[0]);
        arr2.push(dat);
        compPrices[i] = arr2;
        arr2 = [];
    }
    let view = new google.visualization.DataView(google.visualization.arrayToDataTable(compPrices));
    view.setColumns([0, 1,
        {
            role: "annotation"
        },
    ]);

    let options = {
        chart: {
            title: 'Stock Prices :'
        },
        bars: "horizontal"
    };

    let materialChart = new google.charts.Bar(document.getElementById("chart"));
    materialChart.draw(view, options);
}

function drawChart() {
    let inp = document.getElementById("entered").value;
    let arr = [];

    const apiUrl = getapiUrl(inp);

    $.get(apiUrl, function(data) {
        dataset = `${data}`;
        if(!comp.includes(inp)){
            arr.push(inp);
            arr.push(dataset);
            compPrices.push(arr);
            comp.push(inp);
        }

        compPrices.sort(function(a,b){
            return a[1] - b[1];
        });

        let view = new google.visualization.DataView(google.visualization.arrayToDataTable(compPrices));
        view.setColumns([0, 1,
            {
                role: "annotation" },
            ]);

        let options = {
            chart: {
                title: 'Stock Prices :'
            },
            bars: "horizontal"
        };

        let materialChart = new google.charts.Bar(document.getElementById("chart"));
        materialChart.draw(view, options);

        companies++;
        window.setInterval(refresh, 5000);

    })

}
