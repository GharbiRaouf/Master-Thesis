import React from 'react';
import { connect } from 'react-redux';
import { withRouter ,Link} from 'react-router-dom'
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/auth';


function mapStateToProps(state) {
    return {
        token: state.auth.token,
        userEmail: state.auth.userEmail,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

class NotFound extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
            <div className="col-md-8">
                <h1>Not Found</h1>
                <h2>{'\tPerhaps You want to go one of these Links'}</h2>
                {
                    ['A','B','C','D'].map((e,i)=>{
                        return <div><Link key={i} to={"/"+e}>Group {e}</Link><br/></div>
                    })
                }
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NotFound));
