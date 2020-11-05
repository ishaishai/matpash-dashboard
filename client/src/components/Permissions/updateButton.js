import React, {Component} from 'react';

class UpdateButoon extends Component {
   
    render(){
        return( <div>
                    <button type="button" className="btn btn-secondary bg-success" data-toggle="modal" data-target="#exampleModalCenter">
                    שמירת שינויים
                    </button>
                    <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLongTitle"> שמירת שינויים</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                האם לבצע שינויים?
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary bg-danger" data-dismiss="modal">ביטול</button>
                                    <button type="button" className="btn btn-secondary bg-success" data-dismiss="modal" >שמור</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
    
}

export default UpdateButoon;

