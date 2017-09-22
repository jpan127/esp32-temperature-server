
// Creates a table, kind of messy, need to clean up later
function CreateTable(values, height) {
    var body  = document.body;
    var table = document.createElement('table');

    table.style.width  = '99%';
    table.style.border = '1px solid black';

    // Top row
    var top_row = table.insertRow();
    var top_col = [];

    for (var i=0; i<3; i++)
    {
        top_col.push(top_row.insertCell());
        top_col[i].style.border = '1px solid black';
        top_col[i].style.width  = '33%';
        top_col[i].style.textAlign = 'center';
    }

    top_col[0].appendChild(document.createTextNode("Date"));
    top_row.appendChild(top_col[0]);
    top_col[1].appendChild(document.createTextNode("Epoch"));
    top_row.appendChild(top_col[1]);
    top_col[2].appendChild(document.createTextNode("Temperature"));
    top_row.appendChild(top_col[2]);

    for (var i=0; i<height; i++) {
        // Create row
        var row = table.insertRow();
        // Convert epoch to datetime
        var datetime = new Date(0);
        datetime.setUTCSeconds(values[i][0] / 1000);
        var date = (datetime.getMonth() + 1) + '-' + datetime.getDate() + '-' + datetime.getFullYear();
        // Insert as a special column
        var dt_col = row.insertCell();
        dt_col.appendChild(document.createTextNode(date));
        dt_col.style.border = '1px solid black';
        dt_col.style.width  = '33%';
        dt_col.style.textAlign = 'center';
        row.appendChild(dt_col);
        // Insert the rest of the data
        for (var j=0; j<2; j++) {
            var col = row.insertCell();
            col.appendChild(document.createTextNode(values[i][j]));
            col.style.border = '1px solid black';
            col.style.width  = '33%';
            col.style.textAlign = 'center';
            row.appendChild(col);
        }
    }

    body.appendChild(table);
}

// Converts date to epoch
function DateToEpoch(date) {
    var epoch = new Date(date);
    epoch = epoch/1000 + 900 + 330*60;
    epoch *= 1000;
    return epoch;
}

// Parses average temperatures by room
function ParseAverages(room) {
    console.log("Parsing averages...");
    var averages = [];
    var days     = Object.keys(room).length;
    console.log("Number of days: ", days);

    // For each day
    for (var day=0; day<days; day++) {
        // Get key (date)
        var key = Object.keys(room)[day];
        // Get number of hours (array length)
        var hours = room[key].length;
        console.log("Day: ", day, "Number of hours: ", hours);

        // For each hour get average
        for (var hour=0; hour<hours; hour++) {
            var epoch_temp_pair = []
            // Epoch is the first reading in the hour
            epoch_temp_pair.push(room[key][hour][2][0]["epoch"]);
            epoch_temp_pair.push(room[key][hour][1]);
            averages.push(epoch_temp_pair);
        }
    }

    console.log("Finished parsing averages...");
    return averages;
}

// Parses temperature by room
function ParseData(room) {
    console.log("Parsing data...");
    var data = [];
    var days = Object.keys(room).length;
    console.log("Number of days: ", days);

    // For each day
    for (var day=0; day<days; day++) {
        var key   = Object.keys(room)[day];
        var hours = room[key].length;
        console.log("Day: ", day, "Number of hours: ", hours);

        // For each hour in day
        for (var hour=0; hour<hours; hour++) {
            var entries = room[key][hour][2].length;
            // For each entry in hour
            console.log("Hour: ", hour, "Number of entries: ", entries);
            for (var entry=0; entry<entries; entry++) {
                // Get data
                var epoch_temp_pair = []
                epoch_temp_pair.push(room[key][hour][2][entry]["epoch"]);
                epoch_temp_pair.push(room[key][hour][2][entry]["temp"]);
                data.push(epoch_temp_pair);
            }
        }
    }

    console.log("Finished parsing data.");
    return data;
}

// Dark theme by Torstein Honsi
function SetHighchartsTheme() {
    /**
     * (c) 2010-2017 Torstein Honsi
     *
     * License: www.highcharts.com/license
     * 
     * Dark theme for Highcharts JS
     * @author Torstein Honsi
    */

    Highcharts.theme = {
       colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
          '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
       chart: {
          backgroundColor: {
             linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
             stops: [
                [0, '#2a2a2b'],
                [1, '#3e3e40']
             ]
          },
          style: {
             fontFamily: '\'Unica One\', sans-serif'
          },
          plotBorderColor: '#606063'
       },
       title: {
          style: {
             color: '#E0E0E3',
             textTransform: 'uppercase',
             fontSize: '20px'
          }
       },
       subtitle: {
          style: {
             color: '#E0E0E3',
             textTransform: 'uppercase'
          }
       },
       xAxis: {
          gridLineColor: '#707073',
          labels: {
             style: {
                color: '#E0E0E3'
             }
          },
          lineColor: '#707073',
          minorGridLineColor: '#505053',
          tickColor: '#707073',
          title: {
             style: {
                color: '#A0A0A3'

             }
          }
       },
       yAxis: {
          gridLineColor: '#707073',
          labels: {
             style: {
                color: '#E0E0E3'
             }
          },
          lineColor: '#707073',
          minorGridLineColor: '#505053',
          tickColor: '#707073',
          tickWidth: 1,
          title: {
             style: {
                color: '#A0A0A3'
             }
          }
       },
       tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          style: {
             color: '#F0F0F0'
          }
       },
       plotOptions: {
          series: {
             dataLabels: {
                color: '#B0B0B3'
             },
             marker: {
                lineColor: '#333'
             }
          },
          boxplot: {
             fillColor: '#505053'
          },
          candlestick: {
             lineColor: 'white'
          },
          errorbar: {
             color: 'white'
          }
       },
       legend: {
          itemStyle: {
             color: '#E0E0E3'
          },
          itemHoverStyle: {
             color: '#FFF'
          },
          itemHiddenStyle: {
             color: '#606063'
          }
       },
       credits: {
          style: {
             color: '#666'
          }
       },
       labels: {
          style: {
             color: '#707073'
          }
       },

       drilldown: {
          activeAxisLabelStyle: {
             color: '#F0F0F3'
          },
          activeDataLabelStyle: {
             color: '#F0F0F3'
          }
       },

       navigation: {
          buttonOptions: {
             symbolStroke: '#DDDDDD',
             theme: {
                fill: '#505053'
             }
          }
       },

       // scroll charts
       rangeSelector: {
          buttonTheme: {
             fill: '#505053',
             stroke: '#000000',
             style: {
                color: '#CCC'
             },
             states: {
                hover: {
                   fill: '#707073',
                   stroke: '#000000',
                   style: {
                      color: 'white'
                   }
                },
                select: {
                   fill: '#000003',
                   stroke: '#000000',
                   style: {
                      color: 'white'
                   }
                }
             }
          },
          inputBoxBorderColor: '#505053',
          inputStyle: {
             backgroundColor: '#333',
             color: 'silver'
          },
          labelStyle: {
             color: 'silver'
          }
       },

       navigator: {
          handles: {
             backgroundColor: '#666',
             borderColor: '#AAA'
          },
          outlineColor: '#CCC',
          maskFill: 'rgba(255,255,255,0.1)',
          series: {
             color: '#7798BF',
             lineColor: '#A6C7ED'
          },
          xAxis: {
             gridLineColor: '#505053'
          }
       },

       scrollbar: {
          barBackgroundColor: '#808083',
          barBorderColor: '#808083',
          buttonArrowColor: '#CCC',
          buttonBackgroundColor: '#606063',
          buttonBorderColor: '#606063',
          rifleColor: '#FFF',
          trackBackgroundColor: '#404043',
          trackBorderColor: '#404043'
       },

       // special colors for some of the
       legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
       background2: '#505053',
       dataLabelsColor: '#B0B0B3',
       textColor: '#C0C0C0',
       contrastTextColor: '#F0F0F3',
       maskColor: 'rgba(255,255,255,0.3)'
    };

    Highcharts.setOptions(Highcharts.theme);    
}

function CalculateHourlyHighLow(room) {
    console.log("Calulating hourly highs and lows...");
    // Format: [epoch, low, high]
    var data = [];
    var days = Object.keys(room).length;
    console.log("Number of days: ", days);

    // For each day
    for (var day=0; day<days; day++) {
        var key   = Object.keys(room)[day];
        var hours = room[key].length;
        console.log("Day: ", day, "Number of hours: ", hours);

        // For each hour in day
        for (var hour=0; hour<hours; hour++) {
            var epoch_low_high  = []
            var low             = 10000;
            var high            = 0;
            var entries         = room[key][hour][2].length;

            // Epoch is the epoch of the first entry in the hour
            epoch_low_high.push(room[key][hour][2][0]["epoch"]);

            // For each entry in hour
            for (var entry=0; entry<entries; entry++) {
                // Find new highs and lows
                if (room[key][hour][2][entry]["temp"] < low) {
                    low = room[key][hour][2][entry]["temp"];
                }
                if (room[key][hour][2][entry]["temp"] > high) {
                    high = room[key][hour][2][entry]["temp"];
                }
            }
            epoch_low_high.push(low);
            epoch_low_high.push(high);
            data.push(epoch_low_high);            
        }
    }

    console.log("Finished calulating hourly highs and lows.");
    return data;
}

// Main
$(document).ready(function() {

    console.time("Total load time");
    
    $.getJSON("data.json", function(json) {

        // All temperature data
        var values   = ParseData(json["bedroom"]);

        // Ranges from low to high by hour
        var ranges   = CalculateHourlyHighLow(json["bedroom"]);

        // Average temperatures by the hour
        var averages = ParseAverages(json["bedroom"]);

        // console.log("hi");
        console.log("Averages: ", averages);

        // CreateTable(values, values.length);

        Highcharts.chart("bedroom", {

            title: { text: 'BEDROOM' },

            chart: {
                zoomType: 'x'
            },

            xAxis: { 
                type: 'datetime'
            },

            yAxis: {
                title: {
                    text: 'Temperature (Farenheit)'
                }
            },

            tooltip: {
                crosshairs: true,
                shared: true,
                valueSuffix: '\xB0F'
            },

            series: [{
                name: 'Trend',
                data: values,
                zIndex: 1,
                marker: {
                    fillColor: 'white',
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[0]
                }
            }, {
                name: 'Range',
                data: ranges,
                type: 'arearange',
                lineWidth: 0,
                linkedTo: ':previous',
                color: Highcharts.getOptions().colors[0],
                fillOpacity: 0.3,
                zIndex: 0,
                marker: {
                    enabled: false
                }
            }]
        });

        Highcharts.chart("bedroom-averages", {

            title: { text: 'BEDROOM' },

            xAxis: { 
                type: 'datetime',
            },

            yAxis: {
                title: {
                    text: 'Temperature (Farenheit)'
                }
            },

            tooltip: {
                crosshairs: true,
                shared: true,
                valueSuffix: '\xB0F'
            },

            series: [{
                name: 'Averages',
                data: averages,
                zIndex: 1,
                marker: {
                    fillColor: 'white',
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[0]
                }
            }]
        });
    });

    SetHighchartsTheme();

    console.timeEnd("Total load time");
});