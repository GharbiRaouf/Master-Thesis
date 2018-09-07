import React from 'react';
import Grid from '@material-ui/core/Grid'
import { Card, CardMedia, CardActions, Typography, Button, Modal } from '@material-ui/core';
import Register from "../RegisterView"
import { bindActionCreators } from 'redux';
// import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import * as actionCreators from '../../actions/auth';
import { makeAnonymousCanvas } from "../../actions/canvas";

function mapStateToProps(state) {
    return {
        isAuth: Boolean(state.auth.token),
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ...actionCreators, makeAnonymousCanvas, changePage: path => push(path)
    }, dispatch);
}

class Home extends React.Component {
    state = {
        open: false,
        canvas_type: "standard_canvas"
    }
    openRegister = (str) => {
        this.setState({
            open: !this.state.open,
            canvas_type: str
        })
    }
    skipRegister = () => {
        this.props.registerAnonymousUser();
        this.props.makeAnonymousCanvas(this.state.canvas_type)
        this.openRegister();
        this.props.changePage('/trydesigner/')
    }
    render() {
        return <section>
            <div className="container text-center">
                <h1>Welcome to Canvas Maker.</h1>
                <Grid container spacing={8} justify="center" alignItems='stretch' alignContent="stretch">
                    <Grid item xs={6}>
                        <Card>
                            <Button style={{ width: "100%" }} onClick={() => this.openRegister('standard_canvas')}>
                                <CardActions >
                                    <Typography variant="display4">
                                        Try <br />  Business <br /> Canvas
                            </Typography>
                                </CardActions>
                            </Button>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card>
                            <Button style={{ width: "100%" }} onClick={() => this.openRegister('lean_canvas')}>
                                <CardActions >
                                    <Typography variant="display4">
                                        Try <br /> Lean <br /> Canvas
                            </Typography>
                                </CardActions>
                            </Button>
                        </Card>
                    </Grid>
                </Grid>
            </div>
            <Modal open={this.state.open} onClose={() => this.openRegister()}>
                <div>
                    <Register>


                        <Button variant="text" onClick={this.skipRegister}
                        >
                            Skip it for now
                        </Button>
                    </Register>
                </div>
            </Modal>
        </section>;

    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Home)
