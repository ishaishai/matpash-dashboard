import React, { useState } from 'react';
import { connect } from 'react-redux';
import { uploadExcelFile, saveExcelFile, resetResults } from '../actions';
import { validateFile } from '../utils';
import Loader from './Loader';

const Admin = ({ result, loading, resetResults, error, uploadExcelFile, saveExcelFile }) => {
  const [file, setFile] = useState(null);
  const [fileFormatError, setfileFormatError] = useState(false);

  const handlSubmit = e => {
    e.preventDefault();
    if (file && !fileFormatError) {
      uploadExcelFile(file);
    }
  };

  const handleFile = e => {
    resetResults();

    const file = e.target.files[0];

    if (!validateFile(file.name)) {
      setfileFormatError(true);
      setFile(null);
    } else {
      setfileFormatError(false);
      setFile(file);
    }
  };

  const handleSaveExcel = () => {
    saveExcelFile(file.name);
  }

  const mapErrors = errors =>
    errors.map(err => <li style={{ margin: '10px' }}>{err}</li>);

  const success = result?.status === 'success';
  const failure = result?.status === 'failure';

  if (loading) {
    return <Loader message=".אנא המתן, פעולה זו עלולה להמשך מספר דקות" />;
  }

  return (
    <div className="container" dir="rtl" style={{ marginTop: '30px' }}>
      <h3 class="ui dividing header">בדיקת קובץ אקסל</h3>
      <form
        className={`ui form ${success ? 'success' : 'error'}`}
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
            <p>{'קובץ בפורמט לא תקין, אנא בחר קובץ אקסל'}</p>
          </div>
        )}
        {error && (
          <div className="ui error message">
            <div className="header">קובץ אקסל לא תקין</div>
            <p>{error}</p>
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
      {success && (
        <div className="ui success message">
          <div className="header">קובץ תקין</div>
          <p>הקובץ בפורמט תקין וניתן להעלאה</p>
        </div>
      )}
      {failure && (
        <div className="ui error message">
          <div className="header">קובץ אקסל לא תקין</div>
          <ul>{mapErrors(result.errors)}</ul>
        </div>
      )}
      <h3 className="ui dividing header" style={{ marginTop: '50px' }}>
        העלאת קובץ אקסל
      </h3>
      <button
        className={`ui primary button`}
        disabled={!success}
        onClick={handleSaveExcel}
      >
        העלה קובץ
      </button>
      {result === 'OK' && (
        <div className="ui success message">
          <div className="header">הקובץ נשמר</div>
          <p>קובץ האקסל נשמר בהצלחה</p>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ admin: { result, error, loading } }) => ({
  result,
  error,
  loading,
});

export default connect(mapStateToProps, { uploadExcelFile, saveExcelFile, resetResults })(
  Admin,
);
