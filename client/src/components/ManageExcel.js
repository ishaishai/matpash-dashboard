import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getTableNames, getTable, deleteTable } from '../actions';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import Loader from './Loader';

const renderPreview = tableData => {
  if (!tableData || tableData.length === 0) {
    return null;
  }
  return (
    <div className="row bg-light text-dark" style={{ marginTop: '20px' }}>
      {Object.keys(tableData[0]).map(col => (
        <div className="col border border-dark text-center">{col}</div>
      ))}
    </div>
  );
};

function ManageExcel({
  getTableNames,
  getTable,
  deleteTable,
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

  const handleDeleteTable = () => {
    if (TableSelected !== 'בחר טבלה') {
      deleteTable(TableSelected);
    }
    setTableSelected('בחר טבלה');
  };

  const handleExportExcel = () => {};

  return (
    <div dir="rtl">
      <DropdownButton
        id="dropdown-size-small"
        menuAlign="right"
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

      <div className="inline field" style={{ marginTop: '10px' }}>
        <button className="ui button primary" onClick={handleGetTable}>
          {'תצוגה מקדימה'}
        </button>
        <div className="inline field" style={{ marginTop: '10px' }}>
          <label
            className="ui icon button"
            htmlFor="hidden-new-file"
            style={{ marginRight: '0px' }}
          >
            ייצא לקובץ אקסל{'  '}
            <i className="file excel icon"></i>
          </label>
        </div>
        <div className="inline field" style={{ marginTop: '10px' }}>
          <div>
            <button
              type="button"
              className="btn btn-secondary bg-danger"
              data-toggle="modal"
              data-target="#exampleModalCenter"
            >
              מחק טבלה
            </button>
            <div
              className="modal fade"
              id="exampleModalCenter"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalCenterTitle"
              aria-hidden="true"
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLongTitle">
                      {' '}
                      שמירת שינויים
                    </h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    האם אתה בטוח שברצונך למחוק טבלה זו?
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary bg-danger"
                      data-dismiss="modal"
                    >
                      ביטול
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary bg-success"
                      data-dismiss="modal"
                      onClick={handleDeleteTable}
                    >
                      אישור
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPreview && renderPreview(result.table)}
    </div>
  );
}

const mapStateToProps = ({
  admin: { result, error, loading, tableNames },
}) => ({
  result,
  error,
  loading,
  tableNames,
});

export default connect(mapStateToProps, { getTableNames, getTable, deleteTable })(
  ManageExcel,
);
