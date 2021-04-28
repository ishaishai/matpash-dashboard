import React, { useState, useEffect } from 'react';
import { DropdownButton, Dropdown, Form, Button } from 'react-bootstrap';
import Loader from '../Loader';
import axios from 'axios';

const ConceptsView = props => {
  const [loading, setLoading] = useState(true);
  const [concepts, setConcepts] = useState([]);
  const [searchedItem, setSearchedItem] = useState('');
  useEffect(() => {
    fetchConcepts();
  }, []);

  const fetchConcepts = async () => {
    try {
      const response = await axios.get('/api/concepts/get-all');
      setConcepts(response.data.concepts);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = e => {
    setSearchedItem(`\\w*${e.target.value}\\w*`);
  };

  if (loading) {
    return <Loader message=".אנא המתן, פעולה זו עלולה להמשך מספר דקות" />;
  }

  return (
    <div className="concepts-container-dictionary" dir="rtl">
      <div className="concepts-title">מילון מושגים</div>
      <input
        className="concept-search form-control "
        type="text"
        placeholder="חיפוש"
        aria-label="Search"
        onChange={handleSearch}
        style={{ textAlign: 'right' }}
      />
      <div className="concepts-segment">
        {concepts
          .filter(item => {
            if (item.title.match(searchedItem)) return true;
            else return false;
          })
          .map((concept, i) => {
            return (
              <div className="concept-box">
                <div className="concept">
                  <div className="concept-title"> {concept.title} </div>
                  &nbsp;-&nbsp;
                  <div className="concept-description">
                    {concept.definition}
                  </div>
                </div>
                {i < concepts.length - 1 ? <hr /> : null}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ConceptsView;
