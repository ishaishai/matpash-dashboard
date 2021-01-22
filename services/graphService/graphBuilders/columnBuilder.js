const { xAxisTitlePull } = require('./graphHelpers/xAxisTitlePuller');
const { basicSerieBuilder } = require('./graphHelpers/basicSerieBuilder');
const { catagoryBuilder } = require('./graphHelpers/catagoryBuilder');

exports.columnBuilder = async (graph, dashId) => {
  const graphToAdd = { index: graph.index };
  graphToAdd.info = graph.info;
  graphToAdd.layout = {
    xPos: graph.xPos,
    yPos: graph.yPos,
    width: graph.width,
    height: graph.height,
  };
  graphToAdd.options = {
    chart: {
      zoomType: null,
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'column',
    },
    title: {
      text: graph.title,
    },
    subtitle: {
      text: graph.subtitle,
    },
    xAxis: {
      title: {
        text: 'תקופה',
      },
      categories: await catagoryBuilder(graph),
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: graph.yAxisTitle,
      },
    },

    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: await basicSerieBuilder(graph, dashId),

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
  };

  return graphToAdd;
};
