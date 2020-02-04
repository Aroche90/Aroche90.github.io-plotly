//read the names from Json to be part of DropDown menu

function readJson() {
    var url = "samples.json";
    d3.json(url).then(function (data) {
        window.rawData = data;

        // Select values for drop down
        var dropDown = d3.select("#selDataset");
        nameValue = dropDown.selectAll('option')
            .data(data.names)
            .enter()
            .append("option")
            .attr("value", value => value)
            .text(text => text);

        if(data.names.length > 0)
        {
            optionChanged(data.names[0]);
        }
    });
}

readJson();


//function to get values from Metadata on the basis of 
function getMetadata(demographics) {
    var newPanel = d3.select("#sample-metadata");
    newPanel.html("");
    Object.entries(demographics).forEach(([key, value]) => {
        newPanel.append("span")
            .html(`${key} : ${value}`)
            .append("br");
    });
}

//Function to capture the value to draw a Bar Chart
function barChart(chartInfo) {
    var xData = chartInfo.sample_values.slice(0, 10).reverse();
    var barLabels = chartInfo.otu_labels.slice(0, 10).reverse();
    var yData = chartInfo.otu_ids.map(row => `OTU ${row}`).slice(0, 10).reverse();
//chart layout
    var trace = {
        type: "bar",
        title: "Top 10 OTU",
        x: xData,
        y: yData,
        text: barLabels,
        orientation: 'h'
    };
    var data = [trace];

    //Remove top padding
    Plotly.newPlot("bar", data, {}, {
        displayModeBar: false
    });
}

//Function to capture the value to draw a Bubble Chart
function bubbleChart(chartInfo) {
    var xData = chartInfo.otu_ids;
    var yData = chartInfo.sample_values;
    var barLabels = chartInfo.otu_labels;

    var trace2 = {
        x: xData,
        y: yData,
        mode: 'markers',
        marker: {
            color: xData,
            size: yData,
            colorscale: "Earth"
        },
        text: barLabels
    };

    var data = [trace2];
//chart layout
    var layout = {
        title: 'Marker Size',
        showlegend: false,
        height: 600,
        width: 1200
    };
    Plotly.newPlot('bubble', data, layout);
}


//function to change values when name change under drop down
function optionChange(value) {

    var demographics = window.rawData.metadata.find(data => data.id === Number(value));
    getMetadata(demographics);

    var chartInfo = window.rawData.samples.find(data => data.id === value);

    barChart(chartInfo);
    bubbleChart(chartInfo);
   
}