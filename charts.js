function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
  
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleNumber = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = sampleNumber[0];
    console.log(firstSample)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];


    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticksPre = otu_ids.map(sampleObj => "OTU" + sampleObj).reverse();
    var yticks = yticksPre.slice(0, 10);
    console.log(yticks)

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values,
      y: yticks,
      type: "bar",
      orientation:"h",
      text: otu_labels
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
     automargin: true
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: out_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
        markers: {
          size: sample_values,
          color: otu_ids,
          colorscale: ReadableStreamDefaultController,
        }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      automargin: true,
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", bubbleData, bubbleLayout); 




    // Create a variable that holds the samples array. 
  
    // Create a variable that filters the samples for the object with the desired sample number.

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var gaugeData = metadata.filter(metaObj => metaObj.id == sample);
    

    // 2. Create a variable that holds the first sample in the metadata array.
    var firstGauge = gaugeData[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    
    
    

    // 3. Create a variable that holds the washing frequency.
    var wfreq = firstGauge.wfreq;
    console.log(wfreq)
    
    

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
    value: wfreq,
    type: "indicator",
    mode: "gauge+number",
    title: {text: "<b> Belly Button Washing Frequency </b>"},
    gauge: {
      axis: {range: [null,10], dtick: "2"},

      bar: {color: "black"},
      steps:[
        {range: [0, 2], color: "firebrick"},
        {range: [2, 4], color: "darkorange"},
        {range: [4, 6], color: "gold"},
        {range: [6, 8], color: "greenyellow"},
        {range: [8, 10], color: "forestgreen"}
      ],
      dtick: 2
    }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      automargin: true
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
  }
