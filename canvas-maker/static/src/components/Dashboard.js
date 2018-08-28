import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import * as actionCreators from '../actions/auth';
import CanvasPreview from './Canvas/CanvasPreview';
import { fake_dashboard } from './Canvas/fake_dashboard';
import { Grid } from '@material-ui/core';

function mapStateToProps(state) {
    return {
        isRegistering: state.auth.isRegistering,
        registerStatusText: state.auth.registerStatusText,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

class Dashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
            <div className="col-md-12">
                <h1>Dashboard</h1>
                <hr />
                <Grid alignItems="stretch" spacing={10} alignContent="center" justify="center" container>
                    {fake_dashboard.map(element => {
                        return <Grid style={{padding:"3px"}} key={element.project_id} item xs={12} sm={6} md={4} >
                            <CanvasPreview 
                                isPreview={true}
                                preview={element.project_preview}
                                canvasname={element.project_name}
                                canvaslastupdate={element.project_lastUpdate} />
                        </Grid>
                    })}
                    <Grid style={{padding:"3px"}} item xs={12} sm={6} md={4} >
                        <CanvasPreview isPreview={false}/>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));