import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { deleteConcept, getConcepts, addConcept } from '../actions';
import { DropdownButton, Dropdown, Form, Button } from 'react-bootstrap';
import Loader from './Loader';
import './Admin.css';

function AdminConcept({
  getConcepts,
  result,
  error,
  loading,
  concepts,
  addConcept,
  deleteConcept,
}) {
  const [showPreview, setShowPreview] = useState(false);
  const [TableSelected, setTableSelected] = useState('בחר טבלה');
  const [chosenConcept, setChosenConcept] = useState(null);
  useEffect(() => {
    getConcepts();
  }, [getConcepts]);

  const handleConceptAdd = e => {
    e.preventDefault();
    const title = document.getElementById('inputConcept').value;
    const definition = document.getElementById('inputDescrition').value;
    addConcept({ title, definition });
  };

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);
  const handleChosenConcept = e => {
    const found = concepts.filter(item => item.title === e.target.innerHTML)[0];
    setChosenConcept(found);
  };
  if (loading) {
    return <Loader message=".אנא המתן, פעולה זו עלולה להמשך מספר דקות" />;
  }

  const deleteChosenConcept = () => {
    deleteConcept(chosenConcept);
    setChosenConcept(null);
  };
  return (
    <div className="concepts-container" dir="rtl">
      <div className="concepts-dropdown-container">
        <div className="concepts-title">מילון מושגים</div>
        <div>
          <div className="concepts-dropdown-label"> בחר:</div>
          <DropdownButton
            className="concepts-dropdown"
            id="dropdown-size-small"
            menuAlign="right"
            variant="outline-primary"
            title={chosenConcept ? chosenConcept.title : 'מושגים'}
            //  title={TableSelected}
          >
            {concepts.map(item => (
              <Dropdown.Item
                key={item.title}
                className="dropDownItem"
                onClick={handleChosenConcept}
              >
                {item.title}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <Button
            disabled={chosenConcept ? false : true}
            variant="danger"
            className="delete-concept-btn"
            onClick={deleteChosenConcept}
          >
            מחק
          </Button>
        </div>

        <div className="chosen-concept-label">הגדרה:</div>
        <div className="chosen-concept-definition">
          {chosenConcept && chosenConcept.definition}
        </div>
      </div>

      <Form className="concepts-form" onSubmit={handleConceptAdd}>
        <div className="concepts-add-title">הוספת הגדרה</div>
        <Form.Group controlId="inputConcept">
          <Form.Label>מושג</Form.Label>
          <Form.Control className="input-concept" type="text" />
        </Form.Group>

        <Form.Group controlId="inputDescrition">
          <Form.Label>הסבר</Form.Label>
          <Form.Control as="textarea" rows={3} />
        </Form.Group>
        <Button variant="success" type="submit">
          הוסף
        </Button>
      </Form>
    </div>
  );
}

const mapStateToProps = ({ admin: { result, error, loading, concepts } }) => ({
  result,
  error,
  loading,
  concepts,
});

export default connect(mapStateToProps, {
  getConcepts,
  addConcept,
  deleteConcept,
})(AdminConcept);
