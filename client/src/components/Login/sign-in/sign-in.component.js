import React from "react";
import axios from "axios";
import "./sign-in.styles.scss"; 
import FormInput from "../form-input/form-input.component"

import CustomButton from "../custom-button/custom-button.component"; 
//import { use } from "passport";

class SignIn extends React.Component {

    constructor(props){
      super(props);
      this.state ={
      UserName: "",
      Password: ""
      };   
    }   
    handleSubmit = event => { 
    event.preventDefault(); 
    this.setState({ UserName: "", Password: ""});
    };  
    handlechange= event => {
        const {value , name} = event.target; 

        this.setState({[name]: value});
    }; 
    senduserdetails= ()=>{
    const user={ 
    username: this.state.UserName,
    password: this.state.Password
    } 
    axios.post("/api/login",user);
    console.log(user)
    };
    render(){  
        return(    
            
        <div style={{height: "100vh"}} className="image"  > 
            
        <div className="sign-in"> 
       
         <h1> ברוכים הבאים </h1>  
        <form onSubmit={this.handleSubmit}>
            <FormInput name="UserName" type="text" handleChange={this.handlechange}  value={this.state.UserName} label="שם משתמש" required/> 
            <FormInput name="Password" type="password" handleChange={this.handlechange} value={this.state.Password} label="סיסמא" required/> 
            <CustomButton type='submit' onClick={this.senduserdetails}> כניסה </CustomButton>
              </form>
         </div>  
         </div> 
        );
    }
} 
export default SignIn;