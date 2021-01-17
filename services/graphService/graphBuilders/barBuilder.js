const { basicSerieBuilder } = require('./graphHelpers/basicSerieBuilder');
const { catagoryBuilder } = require('./graphHelpers/catagoryBuilder');
const { xAxisTitlePull } = require('./graphHelpers/xAxisTitlePuller');

exports.barBuilder = async (graph, dashId) => {
  const graphToAdd = { index: graph.index };
  graphToAdd.layout = {
    xPos: graph.xPos,
    yPos: graph.yPos,
    width: graph.width,
    height: graph.height,
  };
  graphToAdd.options = {
    chart: {
      type: 'bar',
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

  console.log(graphToAdd.options.series);
  return graphToAdd;
};
