// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument

let allData;

// function init() {
d3.json("samples.json").then(function(importedData) {
    // console.log(importedData);
    allData = importedData;
    var data = importedData;
    var names = data.names;
    var metadata = data.metadata;
    console.log(metadata[0])
    console.log(names)


    var dropDown = d3.select("#selDataset")
                        .selectAll("option")
                            .data(names)
                            .enter()
                            .append("option")
                            .text(function (d) {return d;})
                            .attr("value", function (d) {return d;});

    var samples = data.samples;
    // console.log(samples);
    // console.log(samples[0]);
    // console.log(samples[0].otu_ids);


//////// CHART CHART ----------------------------------------/////////////////////////////////////////////////

    // Trace1 the first 10 objects for plotting
    var trace1 = {
        x: samples[0].sample_values.slice(0, 10).reverse(),
        y: samples[0].otu_ids.slice(0, 10).reverse().toString(),
        text: samples[0].otu_labels.slice(0, 10).reverse().toString(),
        name: "OTU",
        type: "bar",
        orientation: "h",
     
    };

    // data
    var chartData = [trace1];

    // Apply the group bar mode to the layout
    var layout = {
      yaxis: {
          dtick: 1
      },
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };
  
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", chartData, layout);


//////// BUBBLE CHART ----------------------------------------////////////////////////////////////////////
var coloR = [];

var dynamicColors = function() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            return "rgb(" + r + "," + g + "," + b + ")";
         };

for (var i in samples[0].sample_values) {
    coloR.push(dynamicColors());
}
    
// console.log(coloR)

var trace2 = {
  x: samples[0].otu_ids,
  y: samples[0].sample_values,
  text: samples[0].otu_labels,
  mode: 'markers',
  marker: {
    color: coloR,
    opacity: [1, 0.8, 0.6, 0.4],
    size: samples[0].sample_values
  }
};

var data = [trace2];

var layout = {
  hAxis: {title: 'OTU ID'},
  showlegend: false,
  height: 500,
  width: 1200
};

Plotly.newPlot('bubble', data, layout);

//////// SAMPLE METADATA ----------------------------------------////////////////////////////////////////////

var metadata_list = [];
Object.entries(metadata[0]).forEach(([key, value]) => {
    metadata_list.push(key +": "+ value);
 });

console.log(metadata_list)


Demographic_Info = d3.select("#sample-metadata");
Demographic_Info.selectAll("li")
    .data(metadata_list)
    .enter()
    .append("li")
    .html(String);

   
});

// On change to the DOM, call optionChanged()
d3.selectAll("#selDataset").on("change", optionChanged);

// Function called by DOM changes
function optionChanged() {
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.property("value");
    var idx = 0;
    for (var i = 0; i < allData.names.length; i++) {
        if (allData.samples[i].id === dataset) {
            idx = i;
            break;
    }};
       
    console.log(`${dataset}, ${idx}`)
   
    var updatebar = {
        x: [allData.samples[idx].sample_values.slice(0, 10).reverse()],
        y: [allData.samples[idx].otu_ids.slice(0, 10).reverse().toString()],
        text:[(allData.samples[idx].otu_labels.slice(0, 10).reverse())]
    };

    // Call function to update the chart
    updatePlotly(updatebar);

// Update the restyled plot's values
function updatePlotly(newdata) {
    Plotly.restyle("bar", newdata);
}

    var updatebubble = {
        x: [allData.samples[idx].otu_ids],
        y: [allData.samples[idx].sample_values],
        text:[allData.samples[idx].otu_labels]
    };

    // Call function to update the chart
    updatePlotly2(updatebubble);

// Update the restyled plot's values
function updatePlotly2(newdata) {
    Plotly.restyle("bubble", newdata);
}

    var updatemetadata_list = [];
    Object.entries(allData.metadata[idx]).forEach(([key, value]) => {
        updatemetadata_list.push(key +": "+ value);
    });

    console.log(updatemetadata_list)

    // Update new demographic info
    d3.select("ul").selectAll("li").data(updatemetadata_list).text(d => d)

    // // Delete Current Demographic info
    // var deletemetadata = document.getElementById('sample-metadata');
    // deletemetadata.innerHTML = '';

    // // Update with new demographic info
    // Demographic_Info = d3.select("#sample-metadata");
    // Demographic_Info.selectAll("li")
    //     .data(updatemetadata_list)
    //     .enter()
    //     .append("li")
    //     .html(String);


};



// });
// init();