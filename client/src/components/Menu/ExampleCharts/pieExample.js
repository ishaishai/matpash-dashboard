export function pieExample() {
  return {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    title: {
      text: 'Browser market shares in January, 2018',
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories: [],
      labels: {
        style: {
          color: 'black',
        },
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
    series: [
      {
        innerSize: '40%',
        name: 'Brands',
        colorByPoint: true,
        data: [
          {
            name: 'Chrome',
            y: 61.41,
            sliced: false,
            selected: false,
          },
          {
            name: 'Internet Explorer',
            y: 11.84,
          },
          {
            name: 'Firefox',
            y: 10.85,
          },
          {
            name: 'Edge',
            y: 4.67,
          },
          {
            name: 'Safari',
            y: 4.18,
          },
          {
            name: 'Other',
            y: 7.05,
          },
        ],
      },
    ],
  };
}
