import React, {Component} from 'react';
import axios from 'axios';

class SearchBox extends Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e){
        e.preventDefault();
       console.log("SearchBox handleChange:", e.target.value);
       this.props.setSearchStr(e.target.value);
    }

    componentDidMount(){
    }

    render(){
        return(
            <div style={{textAlign: "right"}}>
                <form className="form-inline mt-2 mt-md-0" style={{display: "inline-block"}} onSubmit={(e) => e.preventDefault()}>
                <i class="fas fa-search" aria-hidden="true"></i>
                    <input 
                        className="form-control mr-sm-2" 
                        type="text" 
                        placeholder="חיפוש" 
                        aria-label="Search"
                        onChange={this.handleChange}
                        style={{textAlign: "right"}}
                    />
                </form>
            </div>
        );
    }
    
}

export default SearchBox;

