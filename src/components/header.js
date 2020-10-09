import React, { Component } from "react";
import ReactDOM from "react-dom";
import Users from "./users_table";
import User_permission from "./user_permission";
import User_view_permission from "./user_view_permission";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ""
    };

  }

  render() {
    return (
      <div>
            <div className="bg-primary col-md px-2">
                
                <div className="row w-100 mb-3">
                    <div className="col-8">
                        <a href="#" className="btn btn-lg bg-primary text-white btn-outline-primary" > מתפ״ש - מערכת הרשאות משתמשים </a>
                    </div>
                </div>
            </div>
            <nav>
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <a className="nav-item nav-link active btn-outline-primary" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">משתמשים</a>
                        <a className="nav-item nav-link btn-outline-primary" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">הרשאות משתמשים</a>
                        <a className="nav-item nav-link btn-outline-primary" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">הרשאות צפיה בדשבורד</a>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                        <h3>משתמשים</h3>
                        <Users></Users>
                    </div>

                    <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                        <h2>הרשאות משתמשים</h2>
                        <User_permission></User_permission>

                        <div className="row ">
                            <form className="form-inline mt-2 mt-md-0">
                                <button type="submit" className="btn btn-primary mb-2">עדכן שינויים</button>
                            </form>
                        </div>
                    </div>

                    
                    <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                        <h3>הרשאות צפיה בדשבורד</h3>
                        <User_view_permission></User_view_permission>
                    </div>
                </div>
            </nav>
          
      </div>
    );
  }
}

export default Header;
