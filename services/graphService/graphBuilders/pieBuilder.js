const { pieSerieBuilder } = require('./graphHelpers/pieSerieBuilder');

exports.pieBuilder = async (graph, dashId) => {
  const data = await pieSerieBuilder(graph, dashId);
  console.log(data, 'data');
  const graphToAdd = { index: graph.index };
  graphToAdd.layout = {
    xPos: graph.xPos,
    yPos: graph.yPos,
    width: graph.width,
    height: graph.height,
  };
  graphToAdd.options = {
    sum: 1,
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    title: {
      text: graph.title,
    },
    subtitle: {
      text: graph.subtitle,
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      useHTML: true,
      rtl: true,
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
            },
          },
        },
      ],
    },
    series: data,
  };

  // graphToAdd.options.plotOptions.pie.dataLabels.distance = -50;
  // graphToAdd.options.plotOptions.pie.style = {
  //   fontWeight: 'bold',
  //   color: 'white',
  // };
  // graphToAdd.options.plotOptions.pie.startAngle = -90;
  // graphToAdd.options.plotOptions.pie.endAngle = 90;
  // graphToAdd.options.plotOptions.pie.center = ['50%', '75%'];
  // graphToAdd.options.plotOptions.pie.size = '110%';
  //graphToAdd.options.series.innerSize = '50%';
  console.log(graphToAdd, 'graphtoadd');
  return graphToAdd;
};
