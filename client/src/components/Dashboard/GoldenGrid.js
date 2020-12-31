import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import axios from 'axios';
import './ResponsiveGrid.css';
import { Header, Segment, Statistic, Divider, Icon } from 'semantic-ui-react';

const GoldenGrid = props => {
  const [goldens, setGoldens] = useState([]);
  const [goldensResponse, setGoldenResponse] = useState(false);
  const goldensRef = React.useRef('goldens');

  const ResponsiveGridLayout = WidthProvider(Responsive);

  const deleteGolden = async id => {
    try {
      const response = await axios.delete('/api/dashboard/remove-golden/' + id);
      const { data } = response.data;
    } catch (error) {
      console.log(error);
    }
    getGoldens();
  };
  // chartRef = useMemo(() => highChartsOptions.map((_i) => React.createRef()), []);
  const onResizeStop = useCallback((event, index) => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    });
  }, []);

  const getGoldens = async () => {
    const response = await axios.get('/api/dashboard/get-goldens/');
    if (response.data.goldensList !== undefined) {
      setGoldens(response.data.goldensList);
      console.log(response.data.goldensList);
    }
  };
  const numberWithCommas = num => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const calcGoldenData = MappedGolden => {
    return MappedGolden.periodValue - MappedGolden.periodCmpValue < 0
      ? numberWithCommas(
          -1 *
            parseFloat(
              MappedGolden.periodValue - MappedGolden.periodCmpValue,
            ).toFixed(2),
        )
      : numberWithCommas(
          parseFloat(
            MappedGolden.periodValue - MappedGolden.periodCmpValue,
          ).toFixed(2),
        );
  };
  useEffect(() => {
    getGoldens();
  }, []);

  return (
    <div>
      <ResponsiveGridLayout
        onResizeStop={onResizeStop}
        className="layout"
        compactType="horizontal" // - for free use (need to find the right attribute)
        onLayoutChange={props.onLayoutChange}
      >
        {
          //Map..
          goldens.map(MappedMonitor => (
            <div
              data-grid={{
                x: MappedMonitor.layout.xPos,
                y: MappedMonitor.layout.yPos,
                w: MappedMonitor.goldens.length * 1.5,
                h: MappedMonitor.layout.height,
              }}
              key={MappedMonitor.layout.index}
              className="chartWrap"
            >
              <Segment inverted>
                <Header as="h3" className="monitor-title">
                  <p className="golden">{MappedMonitor.layout.title}</p>
                </Header>
                <Divider inverted />
                <Statistic.Group inverted>
                  <Statistic className="monitor-base" size="mini">
                    <Statistic.Label>סה"כ שינוי</Statistic.Label>
                    <Statistic.Value>22</Statistic.Value>
                    <Statistic.Label>
                      (12 <Icon name="arrow up green" />)
                    </Statistic.Label>
                  </Statistic>
                </Statistic.Group>
                <Divider className="monitor-divider" inverted />
                <Statistic.Group inverted>
                  {MappedMonitor.goldens.map(MappedGolden => (
                    <Statistic className="monitor-base" size="mini">
                      <Statistic.Label>{MappedGolden.subTitle}</Statistic.Label>
                      <Statistic.Label>
                        {MappedGolden.periodValue}
                      </Statistic.Label>
                      <Statistic.Label>
                        ({calcGoldenData(MappedGolden)}
                        )
                        <Icon
                          style={{ marginLeft: '2px' }}
                          name={
                            MappedGolden.periodValue -
                              MappedGolden.periodCmpValue >
                            0
                              ? 'arrow up green'
                              : MappedGolden.periodValue -
                                  MappedGolden.periodCmpValue <
                                0
                              ? 'arrow down red'
                              : 'hand point left outline blue'
                          }
                        />
                      </Statistic.Label>
                    </Statistic>
                  ))}
                </Statistic.Group>
              </Segment>
            </div>
          ))
        }
      </ResponsiveGridLayout>
    </div>
  );
};

export default GoldenGrid;
