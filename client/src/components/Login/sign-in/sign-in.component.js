import React from 'react';
import { connect } from 'react-redux';
import { login } from '../../../actions';
import './sign-in.styles.scss';
import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      UserName: '',
      Password: '',
    };
  }
  handleSubmit = event => {
    event.preventDefault();
    this.setState({ UserName: '', Password: '' });
  };
  handlechange = event => {
    const { value, name } = event.target;

    this.setState({ [name]: value });
  };
  senduserdetails = () => {
    const user = {
      username: this.state.UserName,
      password: this.state.Password,
    };

    this.props.login(user);
  };

  render() {
    // if (this.props.error.msg) {
    //   alert(this.props.error.msg);
    //   this.props.clearErrors();
    // }
    return (
      <div style={{ height: '100vh' }} className="image">
        <div className="sign-in">
          <h1> ברוכים הבאים </h1>
          <form onSubmit={this.handleSubmit}>
            <FormInput
              name="UserName"
              type="text"
              handleChange={this.handlechange}
              value={this.state.UserName}
              placeholder="שם משתמש"
              required
            />
            <FormInput
              name="Password"
              type="password"
              handleChange={this.handlechange}
              value={this.state.Password}
              placeholder="סיסמא"
              required
            />
            <CustomButton type="submit" onClick={this.senduserdetails}>
              {' '}
              כניסה{' '}
            </CustomButton>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(null, { login })(SignIn);
