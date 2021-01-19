const db = require('../../../config/dbConfig');
const { dashboarddbpool, maindbpool, usersdbpool } = db;
const { pieSerieBuilder } = require('./graphHelpers/pieSerieBuilder');

exports.halfPieBuilder = async (graph, dashId) => {
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
      plotBorderWidth: 0,
      plotShadow: false,
      type: 'pie',
    },
    title: {
      text: graph.title,
      align: 'center',
      verticalAlign: 'middle',
      y: 60,
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
        dataLabels: {
          enabled: true,
          distance: -50,
          style: {
            fontWeight: 'bold',
            color: 'white',
          },
        },
        startAngle: -90,
        endAngle: 90,
        center: ['50%', '75%'],
        size: '110%',
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
