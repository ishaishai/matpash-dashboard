const { basicSerieBuilder } = require('./graphHelpers/basicSerieBuilder');
const { catagoryBuilder } = require('./graphHelpers/catagoryBuilder');
const { xAxisTitlePull } = require('./graphHelpers/xAxisTitlePuller');
exports.lineBuilder = async (graph, dashId) => {
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
      type: graph.type,
    },
    title: {
      text: graph.title,
    },

    subtitle: {
      text: graph.subtitle,
    },

    yAxis: {
      title: {
        text: graph.yAxisTitle,
      },
    },

    xAxis: {
      title: {
        text: 'תקופה',
      },
      categories: await catagoryBuilder(graph, dashId),
      crosshair: true,
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
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
