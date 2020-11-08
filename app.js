var path = "./samples.json"

function startPage() {
    
    // Pull the metadata 
    d3.json(path).then((sampleData) => {
    var data = sampleData.metadata;
    
    // Grab the dropdown selector
    var dropdown = d3.select("#selDataset");    

    // Fill the drop list with the test subject IDs
    dropList = []
    data.forEach(i => {
        var subject = dropdown.append("option");
        subject.text(i.id);
        })   

    // Generate the first page
    var firstID = data[0].id;
    fillTable(firstID);
    makeCharts(firstID);    
    })
}

// Trigger when the user changes the Test Subject ID
function optionChanged(newID) {
    fillTable(newID);
    makeCharts(newID);
}

// Fill the demographics sidebar
function fillTable(id) {

    // Pull the metadata
    d3.json(path).then((sampleData) => {
    var data = sampleData.metadata;

    // Grab the table element
    var demoInfo = d3.select("#sample-metadata")

    // Clear any previous table
    demoInfo.html(""); 

    // Generate a blank list and pull the data that matches the new id
    var info = [];
    info = data.filter(i => i.id == id)[0];

    // Send the info to the panel
    Object.entries(info).forEach(function([key, value]) {
        var row = d3.select("#sample-metadata").append("p");
        row.text(`${key} : ${value}`);
    })
})
}

function makeCharts(id) {
    
    // Pull the "samples" data
    d3.json(path).then((sampleData) => {
    var data = sampleData.samples;
    var info = data.filter(i => i.id == id)[0];
    
    // Slice the data from the top 10 OTUs
    var sampleValues = info.sample_values.slice(0,10).reverse(); 
    var otuIds = info.otu_ids.slice(0,10).reverse();
    var otuLabels = info.otu_labels.slice(0,10).reverse();   

    // Create the trace for the plot
    var bar_trace = {
        x: sampleValues,
        y: otuIds.map(label => 'OTU ' + label),
        text: otuLabels,
        type: 'bar',
        orientation: "h"
    };    
    
    // Formatting before plotting
    var bar_data = [bar_trace];
    var layout1 = {autosize: true};

    Plotly.newPlot("bar", bar_data, layout1);

    // Create the trace for the bubble plot
    var bubble_trace = {
        x: info.otu_ids,
        y: info.sample_values,
        text: info.otu_labels,
        mode: 'markers',
        marker: {
            color: info.otu_ids, 
            size: info.sample_values}
    };

    // Formatting before plotting
    var bubble_data = [bubble_trace];
    var layout2 = {
        xaxis: {title: "OTU ID"},
        width: 1200,
        height: 600
    };

    Plotly.newPlot('bubble', bubble_data, layout2)

    })
}

startPage();