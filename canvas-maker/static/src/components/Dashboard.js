import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import * as actionCreators from '../actions/canvas';
import CanvasPreview from './Canvas/CanvasPreview';
import { fake_dashboard } from './Canvas/fake_dashboard';
import { Grid, Typography } from '@material-ui/core';
import { push } from 'react-router-redux';

function mapStateToProps(state) {
    return {
        user_canvas: state.canvas.user_canvas,
        canvas: state.canvas.canvas,
        isFetching: state.canvas.isFetching,
        loaded: state.canvas.loaded,
        token: state.auth.token
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ...actionCreators, changePage: path => push(path)
    }, dispatch);
}

class Dashboard extends React.Component {
    componentDidMount() {
        this.props.loadAllUserCanvas(this.props.token)
    }
    
    render() {
        const { user_canvas } = this.props
        return (
            <div className="col-md-12">
                <h1>Dashboard</h1>
                <hr />
                <Grid alignItems="stretch" spacing={8} alignContent="center" justify="center" container>
                    {user_canvas.map(element => {
                        return (<Grid style={{ padding: "3px" }} key={element.canvas_id} item xs={12} sm={6} md={4} >
                            <CanvasPreview
                                isPreview={true}
                                preview={element.canvas_preview}
                                canvas_id={element.canvas_id}
                                canvas_name={element.canvas_name}
                                canvas_lastUpdate={element.canvas_lastUpdate} />
                        </Grid>)
                    })}

                    {(user_canvas.length == 0) && <Grid justify="center" alignContent="center" alignItems="center" container item xs={12}> <Typography variant="display4">Start makin new canvas</Typography> </Grid>}
                    <Grid style={{ padding: "3px" }} item xs={12} sm={6} md={4} >
                        <CanvasPreview isPreview={false} />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));