import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Chart from './Charts';
import Highcharts from 'highcharts';
import axios from 'axios';

require('highcharts/modules/exporting')(Highcharts);

const defaultContextMenuButtons = Highcharts.getOptions().exporting.buttons
  .contextButton.menuItems;

function ResponsiveGrid(props) {
  const ResponsiveGridLayout = WidthProvider(Responsive);
  const [highChartsOptions, setHighChartsOptions] = useState([]);

  // let chartRef = []; // Create array of refs for each chart
  const chartRef = useMemo(
    () => highChartsOptions.map(_i => React.createRef()),
    [],
  ); // Create array of refs for each chart

  const deleteChart = async id => {
    try {
      const response = await axios.delete(
        '/api/dashboard/remove-graph-from-dashboard/' +
          props.dashboardID +
          '/' +
          id,
      );
      const { data } = response.data;
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    getDashboard();
  };
  // chartRef = useMemo(() => highChartsOptions.map((_i) => React.createRef()), []);
  const onResizeStop = useCallback(
    (event, index) => {
      const chartId = index.i.slice(-1);

      // console.log(chartRef);
      // chartRef[chartId].current.chart.reflow();
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      });
    },
    [chartRef],
  );

  const getDashboard = async () => {
    if (props.dashboardID != null) {
      const result = await axios.get(
        '/api/dashboard/get-by-id/' + props.dashboardID,
      );
      const { dashb } = result.data.dashboard.graphList;

      console.log(props.dashboardID);
      setHighChartsOptions(result.data.dashboard.graphList);

      // console.log(result.data.dashboard.graphlist);

      return result.data.dashboard.graphList;
    }
    return null;
  };

  // Create array of refs for each chart
  useMemo(() => {
    getDashboard();
  }, []);

  useEffect(() => {
    console.log(props.dashboardID);
    getDashboard();
  }, [props.dashboardID]);

  return (
    <div>
      <ResponsiveGridLayout
        onResizeStop={onResizeStop}
        className="layout"
        //compactType="false" - for free use (need to find the right attribute)
        onLayoutChange={props.onLayoutChange}
      >
        {highChartsOptions.map(MappedChart => (
          <div
            data-grid={{
              x: MappedChart.options.layout.xPos,
              y: MappedChart.options.layout.yPos,
              w: MappedChart.options.layout.width,
              h: MappedChart.options.layout.height,
            }}
            key={MappedChart.index}
            className="chartWrap"
          >
            <Chart
              ref={chartRef[MappedChart.index]}
              className="chart"
              id={'chart-' + MappedChart.index}
              options={{
                // ...MappedChart,
                id: MappedChart.index,
                chart: {
                  type: MappedChart.options.chart.type,
                  zoomType: MappedChart.options.chart.zoomType,
                },
                legend: {
                  align: 'center',
                  enabled: true,
                },
                title: {
                  text: MappedChart.options.title.text,
                },
                subtitle: {
                  text: MappedChart.options.subtitle.text,
                },
                tooltip: MappedChart.options.tooltip, ///get prop of tooltip
                plotOptions: {
                  column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                  },
                  pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                      distance:
                        MappedChart.options.plotOptions.pie.dataLabels.distance,
                      enabled:
                        MappedChart.options.plotOptions.pie.dataLabels.enabled,
                    },
                    showInLegend: true,
                    startAngle: MappedChart.options.plotOptions.pie.startAngle,
                    endAngle: MappedChart.options.plotOptions.pie.endAngle,
                    center: MappedChart.options.plotOptions.pie.center,
                    size: MappedChart.options.plotOptions.pie.size,
                  },
                },
                series: MappedChart.options.series.map(obj => ({
                  name: obj.name,
                  data: obj.data,
                  color: obj.colr,
                })),

                xAxis: {
                  categories: MappedChart.options.xAxis.catagories,
                  labels: {
                    style: {
                      color: 'black',
                    },
                    type: MappedChart.options.xAxis.type,
                  },
                },

                exporting: {
                  buttons: {
                    contextButton: {
                      menuItems: [
                        {
                          text: 'מחיקת גרף',
                          onclick: () => {
                            deleteChart(MappedChart.index);
                          },
                        },
                        ...defaultContextMenuButtons,
                      ],
                    },
                  },
                },
              }}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
      {/* <Route path="/CreateChart" exact render={() => <CreateChart />} /> */}
    </div>
  );
}

export default ResponsiveGrid;
