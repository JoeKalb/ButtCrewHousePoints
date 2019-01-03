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
let textOutline = "black"

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
  //am4core.useTheme(am4themes_animated);
  var chart = am4core.create("chartdiv", am4charts.PieChart);
  chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

  chart.data = initialData;
  chart.radius = am4core.percent(70);
  chart.innerRadius = am4core.percent(25);
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

  series.labels.template.text = "{value.value}"
  series.labels.template.disabled = false;

  series.ticks.template.disabled = true;
  series.alignLabels = false;
  series.labels.template.radius = am4core.percent(-30)
  series.labels.template.fill = textColor
  series.labels.template.stroke = textOutline
  series.labels.template.fontSize = 50
  
  series.slices.template.cornerRadius = 10;
  series.slices.template.innerCornerRadius = 7;
  series.slices.template.draggable = true;
  series.slices.template.inert = true;

  series.hiddenState.properties.startAngle = 90;
  series.hiddenState.properties.endAngle = 90;

  // testing labels
  let label = series.createChild(am4core.Label);
  label.text = `| ${initialData[0].house}: ${initialData[0].points} | ${initialData[1].house}: ${initialData[1].points} | ${initialData[2].house}: ${initialData[2].points} | ${initialData[3].house}: ${initialData[3].points} |`;
  label.fontSize = 50;
  label.fontWeight = "bold"
  label.align = "center";
  label.isMeasured = false;
  label.x = -610;
  label.y = 30;
  label.fill = textColor
  label.stroke = textOutline
}

// get initial points when rendering
getCurrentPoints()

// update values every 3 minutes
setInterval(() => {
  getCurrentPoints()
}, 120000)
