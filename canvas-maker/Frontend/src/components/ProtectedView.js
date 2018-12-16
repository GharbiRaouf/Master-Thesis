import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/data';
import PropTypes from 'prop-types';
import land_map from "./Canvas/assets/landing.png"
function mapStateToProps(state) {
    return {
        data: state.data,
        token: state.auth.token,
        loaded: state.data.loaded,
        isFetching: state.data.isFetching,
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

class ProtectedView extends React.Component {
    componentDidMount() {
        this.fetchData();
    }


    fetchData() {
        const token = this.props.token;
        this.props.fetchProtectedData(token);
    }

    render() {
        return (
            <div style={{ width: "100%" }}>
                {!this.props.loaded
                    ? <h1>Loading data...</h1>
                    :
                    <div>
                        <img src={land_map} style={{display: "block",
    marginLeft: "auto",
    marginRight: "auto"}} alt="SiteMap" />
                    </div>
                }
            </div>
        );
    }
}

ProtectedView.propTypes = {
    fetchProtectedData: PropTypes.func,
    loaded: PropTypes.bool,
    userEmail: PropTypes.string,
    data: PropTypes.any,
    token: PropTypes.string,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProtectedView))
