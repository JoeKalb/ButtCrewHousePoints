let initialData = [{
  "house": "Gryffindor",
  "points": 25
}, {
  "house": "Hufflepuff",
  "points": 25
},{
  "house": "Slytherin",
  "points": 25
},{
  "house": "Ravenclaw",
  "points": 25
}];

let textColor = "white"
let textOutline = "white"

// get points
async function getCurrentPoints(){
  
  let response = await fetch(window.location + "houses");
  let json = await response.json()

  compareToChartData(json)
}

// check if data is different from initial
function compareToChartData(updatedPoints){
  let scoreChange = false;

  for(let i = 0; i < 4; ++i){
    if(updatedPoints[initialData[i].house] != initialData[i].points){
      scoreChange = true;
      initialData[i].points = Number(updatedPoints[initialData[i].house])
    }
  }

  if(scoreChange){
    console.log(`New Score Values: ${updatedPoints}`)
    renderPieChart()
  }
}

// display all info
function renderPieChart(){
  am4core.useTheme(am4themes_animated);
  var chart = am4core.create("chartdiv", am4charts.PieChart);
  chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

  chart.data = initialData;
  chart.radius = am4core.percent(70);
  chart.innerRadius = am4core.percent(40);
  chart.startAngle = 180;
  chart.endAngle = 360;  

  var series = chart.series.push(new am4charts.PieSeries());
  series.dataFields.value = "points";
  series.dataFields.category = "house";

  series.colors.list = [
    am4core.color("#9c1203"),
    am4core.color("#e3a000"),
    am4core.color("#033807"),
    am4core.color("#00165e")
  ]

  series.labels.template.text = "{category}: {value.value}"
  series.labels.template.disabled = true;
  series.ticks.template.disabled = true;
  

  series.slices.template.cornerRadius = 10;
  series.slices.template.innerCornerRadius = 7;
  series.slices.template.draggable = true;
  series.slices.template.inert = true;

  series.hiddenState.properties.startAngle = 90;
  series.hiddenState.properties.endAngle = 90;

  chart.legend = new am4charts.Legend();
  chart.legend.labels.template.fill = textColor
  //chart.legend.labels.template.stroke = textOutline
  chart.legend.valueLabels.template.text = "{value.value}"
  chart.legend.valueLabels.template.fill = textColor
  //chart.legend.valueLabels.template.stroke = textOutline
}

// get initial points when rendering
getCurrentPoints()

// update values every 3 minutes
setInterval(() => {
  getCurrentPoints()
}, 120000)
