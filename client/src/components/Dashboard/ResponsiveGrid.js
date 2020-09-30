import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Chart from './Charts';
import HighchartsOptions from './HighchartsOptions';
import Highcharts from 'highcharts';
import NavBar from '../Menu/NavBar';
// import {Button} from "@material-ui/core";
import Button from 'react-bootstrap/Button';
// import Route from "react-router-dom";
import CreateChart from '../Menu/CreateChart';
import { Link, Route, useHistory } from 'react-router-dom';
import axios from 'axios';
import { map } from 'jquery';

require('highcharts/modules/exporting')(Highcharts);

const defaultContextMenuButtons = Highcharts.getOptions().exporting.buttons
  .contextButton.menuItems;

function ResponsiveGrid() {
  const ResponsiveGridLayout = WidthProvider(Responsive);
  const [highChartsOptions, setHighChartsOptions] = useState([]);

  // let chartRef = []; // Create array of refs for each chart
  const chartRef = useMemo(
    () => highChartsOptions.map(_i => React.createRef()),
    []
  ); // Create array of refs for each chart

  const deleteChart = useCallback(id => {
    setHighChartsOptions(prevCharts => {
      return prevCharts.filter((chart, index) => {
        return index !== id;
      });
    });
  }, []);

  // chartRef = useMemo(() => highChartsOptions.map((_i) => React.createRef()), []);
  const onResizeStop = useCallback(
    (event, index) => {
      const chartId = index.i.slice(-1);

      console.log(chartRef);
      // chartRef[chartId].current.chart.reflow();
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      });
    },
    [chartRef]
  );

  const getDashboard = async () => {
    const result = await axios.get(
      'http://localhost:5000/dashboard/get-by-id/1'
    );
    const { dashb } = result.data.dashboard.graphList;

    setHighChartsOptions(result.data.dashboard.graphList);

    console.log(result.data.dashboard.graphlist);

    return result.data.dashboard.graphList;
  };

  // Create array of refs for each chart
  useMemo(() => {
    getDashboard();
  }, []);

  return (
    <div>
      <ResponsiveGridLayout
        onResizeStop={onResizeStop}
        className="layout"
        compactType="horizontal"
      >
        {highChartsOptions.map(MappedChart => (
          <div
            data-grid={{ x: 0, y: 0, w: 3, h: 3 }}
            key={'chart-' + MappedChart.index}
            className="chartWrap"
          >
            {console.log(MappedChart)}
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
                          text: 'Delete',
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
      <Route path="/CreateChart" exact render={() => <CreateChart />} />
    </div>
  );
}

export default ResponsiveGrid;
