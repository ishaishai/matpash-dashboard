import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

const User = props => {
  let userData = {
    username: props.userData['username'],
    firstName: props.userData['firstName'],
    lastName: props.userData['lastName'],
    organization: props.userData['organization'],
    role: props.userData['role'],
    permissions: props.userData['permissions'],
  };
  const [editUserToggle, setEditUserToggle] = useState(false);
  const deleteUser = async username => {
    username = username.replace(/'/g, "''");
    username = username.replace(/"/g, `""`);
    let result = window.confirm('האם למחוק משתמש זה? פעולה זו בלתי הפיכה');
    if (result) {
      const response = await axios.delete('/api/users/delete-user/' + username);
      alert('!המשתמש נמחק');
      props.searchData();
    }
  };

  const editUser = async () => {
    if (editUserToggle) {
      console.log(userData);
      let result = window.confirm('האם לשמור שינויים?');
      if (result) {
        console.log(userData);
        const response = await axios.post('/api/users/update-user/', {
          userData: userData,
        });
        alert('!המשתמש עודכן');
        props.searchData();
      }
      setEditUserToggle(false);
    } else {
      setEditUserToggle(true);
    }
  };

  const setFieldToObj = e => {
    const key = e.target.id;
    const value = e.target.value;

    //need to validate every single change
    userData[key] = value;
  };

  return !editUserToggle ? (
    <div
      id={props.userData.username}
      key={props.userData.username}
      className="row user-details"
    >
      <div className="col border text-center">
        <Button
          className="ui red button buttonOption"
          onClick={() => deleteUser(props.userData['username'])}
        >
          מחק
        </Button>
        {/* <Button className="ui button buttonOption" onClick={() => editUser()}>
          ערוך
        </Button> */}
      </div>
      <div className="col border text-center">
        <div className="innerUserDetailBox">{userData['permissions']}</div>
      </div>
      <div className="col border text-center">
        <div className="innerUserDetailBox">{userData['organization']}</div>
      </div>
      <div className="col border text-center">
        <div className="innerUserDetailBox">{userData['role']}</div>
      </div>
      <div className="col border text-center">
        <div className="innerUserDetailBox">{userData['lastName']}</div>
      </div>
      <div className="col border text-center">
        <div className="innerUserDetailBox">{userData['firstName']}</div>
      </div>
      <div className="col border text-center">
        <div className="innerUserDetailBox">{userData['username']}</div>
      </div>
      {/* <div className="col border text-center">
              {this.state.perPage - (this.state.perPage - i)}
            </div> */}
    </div>
  ) : (
    <div id={userData.username} key={userData.username} className="row ">
      <div className="col border text-center">
        <Button
          className="ui red button buttonOption"
          onClick={() => deleteUser(props.userData['username'])}
        >
          מחק
        </Button>
        <Button
          className="ui button buttonOption"
          onClick={() => editUser(props.userData)}
        >
          שמור
        </Button>
      </div>
      <div className="col border text-center">
        <div className="innerUserDetailBox">{userData['permissions']}</div>
      </div>
      <div className="col border text-center">
        <div className="innerUserDetailBox">
          <input
            className="textEditUser"
            type="text"
            placeholder={userData['organization']}
            onBlur={e => setFieldToObj(e)}
          />
        </div>
      </div>
      <div className="col border text-center">
        <div className="innerUserDetailBox">
          <input
            className="textEditUser"
            type="text"
            placeholder={userData['role']}
            onBlur={e => setFieldToObj(e)}
          />
        </div>
      </div>
      <div className="col border text-center">
        <div className="innerUserDetailBox">
          <input
            className="textEditUser"
            type="text"
            placeholder={userData['lastName']}
            onBlur={e => setFieldToObj(e)}
          />
        </div>
      </div>
      <div className="col border text-center">
        <div className="innerUserDetailBox">
          <input
            className="textEditUser"
            type="text"
            placeholder={userData['firstName']}
            onBlur={e => setFieldToObj(e)}
          />
        </div>
      </div>
      <div className="col border text-center">
        <div className="innerUserDetailBox">
          <input
            id="username"
            className="textEditUser"
            type="text"
            placeholder={userData['username']}
            onBlur={e => setFieldToObj(e)}
          />
        </div>
      </div>
      {/* <div className="col border text-center">
            {this.state.perPage - (this.state.perPage - i)}
          </div> */}
    </div>
  );
};

export default User;
