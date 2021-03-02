import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import axios from 'axios';
import './ResponsiveGrid.css';
import { Header, Segment, Statistic, Divider, Icon } from 'semantic-ui-react';
import { numberWithCommas } from './NumWithCommas';
import { Button } from 'react-bootstrap';

const GoldenGrid = props => {
  const [goldens, setGoldens] = useState([]);
  const [isDraggable, setIsDraggable] = useState(false);
  const goldensRef = React.useRef('goldens');
  const [isViewer, setIsViewer] = useState(() => {
    if (props.user.permissions === 'צופה') {
      return false;
    } else {
      return true;
    }
  });
  const ResponsiveGridLayout = WidthProvider(Responsive);
  const deleteGolden = async index => {
    let result = window.confirm(
      'האם באמת למחוק את הגרף הזה? פעולה זו בלתי הפיכה',
    );
    let response;
    if (result) {
      try {
        const response = await axios.delete(
          '/api/dashboard/remove-golden/' + index,
        );
        const { data } = response.data;
      } catch (error) {
        console.log(error);
      }
      getGoldens();
    }
  };
  // chartRef = useMemo(() => highChartsOptions.map((_i) => React.createRef()), []);
  const onResizeStop = useCallback((event, index) => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    });
  }, []);

  const getGoldens = async () => {
    setGoldens([]);
    const response = await axios.get('/api/dashboard/get-goldens/');
    if (response.data.goldensList !== undefined) {
      setGoldens(response.data.goldensList);
    }
  };

  useEffect(() => {
    console.log(goldens);
  }, [goldens]);

  const calcSummarized = entireGolden => {
    let tmp = entireGolden.goldens;
    var result = [
      tmp.reduce((acc, n) => {
        for (var prop in n) {
          if (acc.hasOwnProperty(prop)) acc[prop] += n[prop];
          else acc[prop] = n[prop];
        }
        return acc;
      }, {}),
    ];
    return parseFloat(result[0].periodValue).toFixed(2);
  };

  const calcSummarizedChange = entireGolden => {
    let tmp = entireGolden.goldens;
    var result = [
      tmp.reduce((acc, n) => {
        for (var prop in n) {
          if (acc.hasOwnProperty(prop)) acc[prop] += n[prop];
          else acc[prop] = n[prop];
        }
        return acc;
      }, {}),
    ];
    entireGolden.sum = result[0].periodValue - result[0].periodCmpValue;

    return calcGoldenData(result[0]);
  };

  const calcGoldenData = MappedGolden => {
    console.log(MappedGolden);
    return MappedGolden.periodValue - MappedGolden.periodCmpValue < 0
      ? -1 *
          parseFloat(
            MappedGolden.periodValue - MappedGolden.periodCmpValue,
          ).toFixed(2)
      : parseFloat(
          MappedGolden.periodValue - MappedGolden.periodCmpValue,
        ).toFixed(2);
  };

  const calcAverageSum = MappedMonitor => {
    console.log(calcSummarized(MappedMonitor));
    return numberWithCommas(
      calcSummarized(MappedMonitor) /
        (MappedMonitor.goldens.length != 0 ? MappedMonitor.goldens.length : 1),
    );
  };

  useEffect(() => {
    getGoldens();
  }, []);

  const printValueByType = (valuetype, value) => {
    console.log(valuetype);
    let strValue = '';
    switch (valuetype) {
      case 'אחוזים - %':
        strValue = `${value}%`;
        break;
      case 'מש"ח - ₪':
        strValue = `${value}₪ מש"ח`;
        break;
      case 'מיש"ח - ₪':
        strValue = `${value}₪ מיש"ח`;
        break;
      case 'מ"ד - $':
        strValue = `${value}$ מ"ד`;
        break;
      case 'מל"ד - $':
        strValue = `${value}$ מל"ד`;
        break;
      default:
        strValue = `${value}`;
    }
    console.log(strValue);
    return strValue;
  };

  window.addEventListener('resize', () => {
    if (window.screen.width < 992) {
      setIsDraggable(false);
    } else {
      setIsDraggable(true);
    }
  });

  if (goldens && goldens.length == 0) {
    return null;
  }

  return (
    <div className="goldensWrapper">
      <ResponsiveGridLayout
        isDraggable={isDraggable}
        isResizable={isDraggable}
        onResizeStop={onResizeStop}
        className="layout"
        //  compactType="horizontal" // - for free use (need to find the right attribute)
        onLayoutChange={props.onLayoutChange}
      >
        {
          //Map..
          goldens.map(MappedMonitor => (
            <div
              data-grid={{
                x: MappedMonitor.layout.xPos,
                y: MappedMonitor.layout.yPos,
                w: MappedMonitor.layout.width,
                h: MappedMonitor.layout.height,
              }}
              key={MappedMonitor.layout.index}
              className="MonitorWrap"
            >
              <Segment inverted>
                {isViewer ? (
                  <Button
                    className="red ui button monitor"
                    onClick={() => deleteGolden(MappedMonitor.layout.index)}
                  >
                    מחק
                  </Button>
                ) : null}
                <Segment inverted className="monitorwrap-innersegment">
                  <Header as="h3" className="monitor-title">
                    <p className="golden">{MappedMonitor.layout.title}</p>
                  </Header>
                  <Statistic.Group inverted>
                    <Statistic className="monitor-base" size="mini">
                      <Statistic.Label>
                        {MappedMonitor.layout.actionType == 'סכום'
                          ? `סה"כ לתקופה`
                          : `ממוצע לתקופה`}
                      </Statistic.Label>
                      <Statistic.Value>
                        {printValueByType(
                          MappedMonitor.layout.valuetype,
                          MappedMonitor.layout.actionType == 'סכום'
                            ? numberWithCommas(calcSummarized(MappedMonitor))
                            : calcAverageSum(MappedMonitor),
                        )}
                      </Statistic.Value>
                      <Statistic.Label>
                        שינוי ביחס לתקופה קודמת
                        <br />(
                        {printValueByType(
                          MappedMonitor.layout.valuetype,
                          numberWithCommas(calcSummarizedChange(MappedMonitor)),
                        )}
                        <Icon
                          name={
                            MappedMonitor.sum > 0
                              ? 'arrow up green'
                              : MappedMonitor.sum < 0
                              ? 'arrow down red'
                              : 'hand point left outline blue'
                          }
                        />
                        )
                      </Statistic.Label>
                    </Statistic>
                  </Statistic.Group>
                  <Divider className="monitor-divider" inverted />
                  <Statistic.Group inverted className="subStatistics">
                    {MappedMonitor.goldens.map(MappedGolden => (
                      <Statistic className="monitor-base" size="mini">
                        <Statistic.Label>
                          {MappedGolden.subTitle}
                        </Statistic.Label>
                        <Statistic.Label>
                          {printValueByType(
                            MappedMonitor.layout.valuetype,
                            numberWithCommas(
                              parseFloat(MappedGolden.periodValue).toFixed(2),
                            ),
                          )}
                        </Statistic.Label>
                        <Statistic.Label>
                          (
                          {printValueByType(
                            MappedMonitor.layout.valuetype,
                            numberWithCommas(calcGoldenData(MappedGolden)),
                          )}
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
                          )
                        </Statistic.Label>
                      </Statistic>
                    ))}
                  </Statistic.Group>
                </Segment>
              </Segment>
            </div>
          ))
        }
      </ResponsiveGridLayout>
    </div>
  );
};

export default GoldenGrid;
