import React, { useMemo, useState, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Chart from './Charts';
import HighchartsOptions from './HighchartsOptions';
import Highcharts from 'highcharts';
import axios from 'axios';
require('highcharts/modules/exporting')(Highcharts);

const defaultContextMenuButtons = Highcharts.getOptions().exporting.buttons
  .contextButton.menuItems;

function ResponsiveGrid(props) {
  const chartRef = useMemo(
    () => HighchartsOptions.map(_i => React.createRef()),
    []
  ); // Create array of refs for each chart
  const ResponsiveGridLayout = WidthProvider(Responsive);
  // const [highChartsOptions, setHighChartsOptions] = useState(HighchartsOptions);
  const [highChartsOptions, setHighChartsOptions] = useState([]);
  const [layout, setLayout] = useState([]);

  const deleteChart = useCallback(id => {
    setHighChartsOptions(prevCharts => {
      return prevCharts.filter((chart, index) => {
        return index !== id;
      });
    });
  }, []);

  const onResizeStop = useCallback(
    (event, id) => {
      const chartId = id.i.slice(-1);
      chartRef[chartId].current.chart.reflow();
      console.log(chartRef);
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      });
    },
    [chartRef]
  );

     
  const getDashboard = async () => {
    const result = await axios.get("http://localhost:5000/dashboard/get-by-id/1");
    const { dashb } = result.data.dashboard.graphList;
    
     setHighChartsOptions(result.data.dashboard.graphList);
    
    console.log(result.data);
  

    return result.data.dashboard.graphList;
  };

   // Create array of refs for each chart
  useMemo(() => {
    getDashboard();
  
  }, []);

  return (
    <ResponsiveGridLayout
      onLayoutChange={props.onLayoutChange}
      onResizeStop={onResizeStop}
      className="layout"
      layout={layout}
      compactType="horizontal"
    >
      {highChartsOptions.map((MappedChart) => (
        <div
          data-grid={{ x: 0, y: 0, w: 3, h: 3 }}
          key={'chart-' + MappedChart.index}
          className="chartWrap"
        >
          <Chart
            ref={chartRef[MappedChart.index]}
            className="chart"
            id={'chart-' + MappedChart.index}
            options={{
              // ...MappedChart,
              id: MappedChart.index,
              chart:{
                type: MappedChart.type,
            },legend: {
                enabled: MappedChart.legend,
              },
              title: {
                text:MappedChart.title,
              },
              subtitle: {
                text:MappedChart.subtitle,
              },
              series:  MappedChart.series.map(obj => ({
                name: obj.name,
                data: obj.data.map(Number),
                color: obj.colr
              })),
               
              xAxis: {
                title: {
                  text: MappedChart.xAxisTitle,
                  style: {
                    color: "black",
                  },
              },
                categories: MappedChart.xAxisCatagoryRange,
                labels: {
                  style: {
                    color: "black",
                  },
                },
              },
              yAxis: {
                title: {
                  text: MappedChart.yAxisTitle,
              },
                categories: MappedChart.yAxisCatagoryRange,
                labels: {
                  style: {
                    color: "black",
                  },
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
  );
}

export default ResponsiveGrid;
