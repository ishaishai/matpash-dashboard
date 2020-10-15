import React, { useState } from 'react';
import { connect } from 'react-redux';
import { checkExcel } from '../actions';
import { validateFile } from '../utils';

const Admin = ({ result, error, checkExcel }) => {
  const [file, setFile] = useState(null);
  const [fileFormatError, setfileFormatError] = useState(null);

  const handlSubmit = e => {
    e.preventDefault();
    //checkExcel(file);
  };

  const handleFile = e => {
    const file = e.target.files[0];

    if (validateFile(file.name)) {
      setfileFormatError(null);
      setFile(file);
    } else {
      setfileFormatError('קובץ בפורמט לא תקין, אנא בחר קובץ אקסל');
      setFile(null);
    }
  };

  const succes = result === 'success';
  
  return (
    <div className="container" dir="rtl" style={{ marginTop: '30px' }}>
      <h3 class="ui dividing header">בדיקת קובץ אקסל</h3>
      <form
        className={`ui form ${succes ? 'success' : 'error'}`}
        onSubmit={handlSubmit}
      >
        <div className="inline field">
          <label
            className="ui icon button"
            htmlFor="hidden-new-file"
            style={{ marginRight: '0px' }}
          >
            בחר קובץ לבדיקה{'  '}
            <i className="file excel icon"></i>
          </label>
          <input
            type="file"
            name="excelFile"
            id="hidden-new-file"
            style={{ display: 'none' }}
            onChange={handleFile}
          />
        </div>
        {file && <h5>{file.name}</h5>}
        {fileFormatError && (
          <div className="ui error message">
            <div className="header">פורמט לא תקין</div>
            <p>{fileFormatError}</p>
          </div>
        )}
        {error && (
          <div className="ui error message">
            <div className="header">קובץ אקסל לא תקין</div>
            <p>{error}</p>
          </div>
        )}
        {result === 'success' && (
          <div className="ui success message">
            <div className="header">קובץ תקין</div>
            <p>הקובץ בפורמט תקין וניתן להעלאה</p>
          </div>
        )}
        <div className="inline field">
          <button
            className="ui primary button"
            disabled={!file ? true : false}
            type="submit"
          >
            בצע בדיקה
          </button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = ({ admin: { result, error } }) => ({ result, error });

export default connect(mapStateToProps, { checkExcel })(Admin);
