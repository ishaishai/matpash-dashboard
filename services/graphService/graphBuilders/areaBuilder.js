const { basicSerieBuilder } = require('./graphHelpers/basicSerieBuilder');
const { catagoryBuilder } = require('./graphHelpers/catagoryBuilder');
const { xAxisTitlePull } = require('./graphHelpers/xAxisTitlePuller');

exports.areaBuilder = async (graph, dashId) => {
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
      type: 'area',
    },
    title: {
      text: graph.title,
    },
    xAxis: {
      title: {
        text: 'תקופה',
      },
      categories: await catagoryBuilder(graph),
    },
    yAxis: {
      title: {
        text: graph.yAxisTitle,
      },
    },
    credits: {
      enabled: false,
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
