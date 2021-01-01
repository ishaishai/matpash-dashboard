import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getTableNames, getTable } from '../actions';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import Loader from './Loader';

function ManageExcel({
  getTableNames,
  getTable,
  result,
  error,
  tableNames,
  loading,
}) {
  const [showPreview, setShowPreview] = useState(false);
  const [TableSelected, setTableSelected] = useState('בחר טבלה');

  useEffect(() => {
    getTableNames();
  }, [getTableNames]);

  // const success = result?.status === 'success';
  // const failure = result?.status === 'failure';

  if (loading) {
    return <Loader message=".אנא המתן, פעולה זו עלולה להמשך מספר דקות" />;
  }

  const handleTableSelection = event => {
    let selectedPeriodTable = event.target.innerHTML;
    setTableSelected(selectedPeriodTable);
  };

  const handleGetTable = () => {
    if (TableSelected !== 'בחר טבלה') {
      getTable(TableSelected);
      setShowPreview(true);
    }
  };

  return (
    <div className="container" dir="rtl">
      <DropdownButton
        className="dropdown-btn choose-dash-btn"
        type=""
        variant="outline-primary"
        title={TableSelected}
      >
        {tableNames.map(name => (
          <Dropdown.Item
            key={name}
            className="dropDownItem"
            onClick={handleTableSelection}
          >
            {name}
          </Dropdown.Item>
        ))}
      </DropdownButton>

      <button className="ui button primary" onClick={handleGetTable}>
        {'תצוגה מקדימה'}
      </button>
      {showPreview && (
        <div className="row bg-light text-dark">
          {Object.keys(result.table[0]).map(col => (
            <div className="col border border-dark text-center">{col}</div>
          ))}
          {/* {result.table.map((row, i) => (
            <div key={i} className="row">
              {Object.keys(row).map(key => (
                <div className="col border text-center">{row[key]}</div>
              ))}
            </div>
          ))} */}
        </div>
      )}
    </div>
  ); // console.log(kvTableResult.rows);
}

const mapStateToProps = ({
  admin: { result, error, loading, tableNames },
}) => ({
  result,
  error,
  loading,
  tableNames,
});

export default connect(mapStateToProps, { getTableNames, getTable })(
  ManageExcel,
);
