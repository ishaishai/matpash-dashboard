import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getTableNames } from '../actions';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import Loader from './Loader';

function ManageExcel({ getTableNames, result, error, loading }) {
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

  return (
    <div className="container" dir="rtl">
      {result.tableList && (
        <DropdownButton
          className="dropdown-btn choose-dash-btn"
          type=""
          variant="outline-primary"
          title={TableSelected === '' ? 'בחר' : TableSelected}
        >
          {result.tableList.map(name => (
            <Dropdown.Item
              key={name}
              className="dropDownItem"
              onClick={handleTableSelection}
            >
              {name}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      )}
    </div>
  );
}

const mapStateToProps = ({ admin: { result, error, loading } }) => ({
  result,
  error,
  loading,
});

export default connect(mapStateToProps, { getTableNames })(ManageExcel);
