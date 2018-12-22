import React from 'react';
import Grid from '@material-ui/core/Grid'
import { Card, CardActions, Typography, Button, Modal, Dialog, DialogTitle, DialogContent, DialogContentText, CircularProgress } from '@material-ui/core';
import Register from "../RegisterView"
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux';
// import { withRouter } from 'react-router-dom'
import nanoid from 'nanoid'
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
    constructor(props) {
        super(props)
        this.state = { dirr: props.location.pathname[1] }
        this.skipRegister = this.skipRegister.bind(this)
    }
    state = {
        open: false,
        dirr: "A",
        openAuthProgress:false,
        canvas_type: "standard_canvas"
    }
    openRegister = (str) => {
        this.setState({
            open: !this.state.open,
            canvas_type: str
        })
    }
    skipRegister = () => {
        this.setState({
            openAuthProgress:true
        })
        this.props.loginUser("anonymous" + nanoid(5) + "@canvas.com", "@canvas2018", this.state.dirr).then(() => {
            // console.log("Connected to anonymous");
            this.setState({
                openAuthProgress:false
            })

        });
        this.openRegister(this.state.canvas_type);
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
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={this.state.openAuthProgress}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Authentificating as an Anonymous User ..."}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText align="center" id="alert-dialog-description">
                        <CircularProgress />
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </section>;

    }
}



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home))
