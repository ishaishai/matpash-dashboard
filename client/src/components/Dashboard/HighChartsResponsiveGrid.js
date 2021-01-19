import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Chart from './Charts';
import { Header } from 'semantic-ui-react';
import axios from 'axios';
import './ResponsiveGrid.css';
import { numberWithCommas } from './NumWithCommas';

const HighChartsResponsiveGrid = props => {
  const ResponsiveGridLayout = WidthProvider(Responsive);
  const [highChartsOptions, setHighChartsOptions] = useState([]);
  const highChartsOptionsRef = React.useRef('highChartsOptions');

  // let chartRef = []; // Create array of refs for each chart
  const chartRef = useMemo(
    () => highChartsOptions.map(_i => React.createRef()),
    [],
  ); // Create array   of refs for each chart

  const deleteChart = async id => {
    try {
      const response = await axios.delete(
        '/api/dashboard/remove-graph-from-dashboard/' +
          props.dashboardID +
          '/' +
          id,
      );
      const { data } = response.data;
    } catch (error) {
      console.log(error);
    }
    getDashboard();
  };
  // chartRef = useMemo(() => highChartsOptions.map((_i) => React.createRef()), []);
  const onResizeStop = useCallback(
    (event, index) => {
      const chartId = index.i.slice(-1);
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      });
    },
    [chartRef],
  );

  const getDashboard = async () => {
    setHighChartsOptions([]);
    if (props.dashboardID != null) {
      const result = await axios.get(
        '/api/dashboard/get-by-id/' + props.dashboardID,
      );
      setHighChartsOptions(result.data.dashboard.graphList);
    }
    return null;
  };

  const flipGraph = async (event, index) => {
    if (document.getElementById(index).style.transform === '')
      document.getElementById(index).style.transform = 'rotateY(-180deg)';
    else {
      document.getElementById(index).style.transform = 'rotateY(180deg)';
      document.getElementById(index).style.transform = '';
    }
  };

  useEffect(() => {
    highChartsOptionsRef.current = highChartsOptions;
  }, [highChartsOptions]);

  useEffect(() => {
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
              x: MappedChart.layout.xPos,
              y: MappedChart.layout.yPos,
              w: MappedChart.layout.width,
              h: MappedChart.layout.height,
            }}
            key={MappedChart.index}
            className="chartWrap"
          >
            {console.log(MappedChart)}
            <div className="card-flip" id={MappedChart.index}>
              <div className="card front">
                <Chart
                  ref={chartRef[MappedChart.index]}
                  className="chart"
                  id={'chart-' + MappedChart.index}
                  options={{
                    ...MappedChart.options,
                    series: MappedChart.options.series,
                    plotOptions: {
                      ...MappedChart.options.plotOptions,
                      series: {
                        animation: {
                          duration: 5000,
                        },
                      },
                    },
                    id: MappedChart.index,
                    credits: {
                      enabled: false,
                    },
                    lang: {
                      printChart: "<p style='text-align:right'>הדפסת גרף</p>",
                      downloadPNG:
                        "<p style='text-align:right'>PNG-הורדה כ</p>",
                      downloadPDF:
                        "<p style='text-align:right'>PDF-הורדה כ </p>",
                      downloadJPEG:
                        "<p style='text-align:right'>JPEG-הורד כ</p>",
                      downloadSVG:
                        "<p style='text-align:right'>SVG-הורדה כ </p>",
                      viewFullscreen:
                        "<p style='text-align:right'>צפייה במסך מלא</p>",
                    },
                    tooltip: {
                      style: {
                        textAlign: 'right',
                        fontSize: '16px',
                      },
                      formatter:
                        MappedChart.options.chart.type == 'pie'
                          ? function () {
                              if (this.point || this.points) {
                                console.log(this.point);
                                return `<span dir="rtl">${this.point.name}
                                  <div style="padding:0"><b>${parseFloat(
                                    this.point.y,
                                  ).toFixed(2)}%</b></div>
                                  <div style="padding:0">ערך מספרי: ${numberWithCommas(
                                    parseFloat(this.point.actualValue),
                                  )}</div>
                                  </span>
                                  `;
                              }
                            }
                          : // : null,
                            function () {
                              let x = this.x;
                              const tmpChart = this.points[0].series.chart;
                              console.log(tmpChart);
                              let valuesTooltip = tmpChart.series
                                .map(MappedSerie => {
                                  for (let point of MappedSerie.points) {
                                    if (point.category == this.x) {
                                      return `<div dir="rtl">
                                      <b>${point.series.name}: </b>
                                          <div dir="ltr">${numberWithCommas(
                                            parseFloat(point.y).toFixed(2),
                                          )}</div>
                                          </div>`;
                                    }
                                  }
                                })
                                .join('');
                              console.log(valuesTooltip);
                              return `
                                <span dir="rtl">
                                  <b>${this.x}</b>
                                  <div style="padding:0"></div>
                                  ${valuesTooltip}
                                </span>`;
                            },

                      //   for (let point of this.points) {
                      //     return `<span><b>${this.x}</b>
                      // <div style="padding:0"><b>${parseFloat(
                      //   this.y,
                      // ).toFixed(2)} ${
                      //       this.points[0].series.name
                      //     }</b></div>
                      // </span>
                      // `;
                      //   }
                      shared: true,
                      useHTML: true,
                    },
                    exporting: {
                      buttons: {
                        contextButton: {
                          menuItems: [
                            props.permissions != 'צופה'
                              ? {
                                  text:
                                    "<p style='text-align:right'>מחיקת גרף </p>",
                                  onclick: () => {
                                    deleteChart(MappedChart.index);
                                  },
                                }
                              : null,
                            {
                              text:
                                "<p style='text-align:right'>הצג מידע נוסף </p>",
                              onclick: event => {
                                flipGraph(event, MappedChart.index);
                              },
                            },
                            ...Object.values(props.userGraphOptions),
                          ],
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="card back">
                <Header as="h3">
                  <p>{MappedChart.options.title.text}</p>
                </Header>
                <p>
                  luram,luramluramluraramluraramluraramluramluram,luramluramluramluram,luramluram
                </p>

                <button
                  className="ui left green labeled icon button btn-goback"
                  onClick={event => flipGraph(event, MappedChart.index)}
                >
                  חזור
                  <i className="left arrow icon"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
      {/* <Route path="/CreateChart" exact render={() => <CreateChart />} /> */}
    </div>
  );
};

export default HighChartsResponsiveGrid;
