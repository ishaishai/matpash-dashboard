import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Chart from './Charts';
import { numberWithCommas } from './NumWithCommas';
import { Header } from 'semantic-ui-react';
import axios from 'axios';
import './ResponsiveGrid.css';
import { Form } from 'react-bootstrap';
import GraphChart from './GraphChart';

import { connect } from 'react-redux';
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
      let result = window.confirm(
        'האם באמת למחוק את הגרף הזה? פעולה זו בלתי הפיכה',
      );
      let response;
      if (result) {
        response = await axios.delete(
          '/api/dashboard/remove-graph-from-dashboard/' +
            props.dashboardID +
            '/' +
            id,
        );
        alert('הגרף נמחק!');
      }

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
            <GraphChart
              MappedChart={MappedChart}
              chartRef={chartRef}
              deleteChart={deleteChart}
              userGraphOptions={props.userGraphOptions}
              permissions={props.permissions}
            />
            {console.log(MappedChart)}
          </div>
        ))}
      </ResponsiveGridLayout>
      {/* <Route path="/CreateChart" exact render={() => <CreateChart />} /> */}
    </div>
  );
};

const mapStateToProps = ({ auth: { user } }) => ({ user });
export default connect(mapStateToProps)(HighChartsResponsiveGrid);
