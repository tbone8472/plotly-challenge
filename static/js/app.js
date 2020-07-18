
// declare arrays
var samples, otu_labels,sample_values,otu_ids,reverse_otuids,xbar,ybar = [];


// Generate data for Metadata Panel and populate values for
// dropdown menu
function optionChanged(metadata, samples) {
  d3.json('../data/samples.json').then(function (data) {
    var subject_id = d3.select('#selDataset').node().value;

    var metadata = data.metadata.filter(function (d) {
      return d.id == subject_id;
    })[0];
    var samples = data.samples.filter(function (d) {
      return d.id == subject_id;
    });

    // use d3 to target div with id of `#sample-metadata`
    // and make sure we clear any previous selection
    var selectedData = d3.select('#sample-metadata');
    selectedData.text('');

    Object.entries(metadata).forEach(([key, value]) => {
      selectedData.append('p').text(`${key}: ${value}`);
    });

    // perform data sort
    samples.sort(function (a, b) {
      return parseInt(b.sample_values) - parseInt(a.sample_values);
    });

    // now populate arrays with data from selected samples
    otu_ids = samples[0].otu_ids;
    top_otu_ids = otu_ids.slice(0, 10).reverse();
    otu_labels = samples[0].otu_labels;
    top_otu_labels = otu_labels.slice(0, 10).reverse();
    sample_values = samples[0].sample_values;
    top_sample_values = sample_values.slice(0, 10).reverse();

    // format OTU for nicer display
    var ticks = top_otu_ids.map((otu) => `OTU ${otu}`);

    // Begin our trace

    // Firt - our Bar chart
    var trace1 = {
      x: top_sample_values,
      y: ticks,
      text: top_otu_labels,
      type: 'bar',
      orientation: 'h',
    };

    var barChartData = [trace1];

    var layout = {
      title: `Top 10 OTUs`,
      xaxis: { title: 'Sample Value' },
    };

    Plotly.newPlot('bar', barChartData, layout);

    // Next - our Bubble chart
    var trace2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        colorscale: [
          [0, 'green'],
          [1, 'red'],
        ],
        opacity: 0.75,
        size: sample_values,
        sizeref: 0.05,
        sizemode: 'area',
      },
    };
    // define Bubble charts
    // with display options
    var bubbleChartData = [trace2];
    var layoutBubble = {
      title: `Belly Button Bacteria Bubble Chart`,
      height: 500,
      width: 900,
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Value' },
    };

    Plotly.newPlot('bubble', bubbleChartData, layoutBubble);
  });
}

// populate drop-down menu with data from
// json sample file
function init() {
  var dropDownMenu = d3.select('#selDataset');
  d3.json('../data/samples.json').then(function (data) {
    var names = data.names;
    for (var name of names) {
      dropDownMenu.append('option').attr('value', name).text(name);
    }
  });
}

// populate the drop down menu with
// data from sample json file
function init() {
  var dropDownMenu = d3.select('#selDataset');

  d3.json('data/samples.json').then(function (data) {
    var data = data;
    var names = data.names;

    for (var name of names) {
      dropDownMenu.append('option').attr('value', name).text(name);
    }
  });

    
  
  // Now render Charts
  optionChanged();
}

init();