import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import timeago from 'timeago.js';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { compose } from 'redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/canvas';
import { CanvasPreviewStyle } from "./assets/canvasstyle";
import Slide from "@material-ui/core/Slide"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogActions from "@material-ui/core/DialogActions"

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        canvas: state.canvas.canvas,
        userEmail: state.auth.userEmail,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ...actionCreators, changePage: path => push(path)
    }, dispatch);
}

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class Preview extends React.Component {
    state = {
        anchorEl: null,
        deletePanelOpen: false
    };

    dispatchNewRoute(route) {
        this.props.changePage(route)
    }


    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = (option) => {
        this.setState({ anchorEl: null });
        if (option == "Delete Canvas") {
            this.setState({ deletePanelOpen: true })
        }
    };
    setCanvas = (canvas_id) => {
        this.props.changePage("/designer/" + canvas_id)
    }

    initiateCanvas = (canvas_type) => {
        // const canvas_type = "standard_canvas"
        this.props.createNewCanvas(canvas_type, this.props.token)
        console.log("initiateCanvas");

        // this.dispatchNewRoute('/designer/New_Canvas')
    }

    handleCancelDelete = () => {
        this.setState({
            deletePanelOpen: false
        })
    }
    handleConfirmDelete = (canvas_id) => {
        this.props.deleteCanvas(canvas_id, this.props.token)
        this.handleCancelDelete()
    }

    render() {
        const { classes, isPreview, canvas_preview, canvas_name, canvas_lastUpdate, canvas_id } = this.props;
        const { anchorEl } = this.state;
        const expanded = !!anchorEl;
        return (
            <Card className={classes.card}>
                {isPreview ? (
                    <div>
                        <CardContent onClick={() => this.setCanvas(canvas_id)} >
                            {console.log(canvas_preview)}
                            <img className={classes.media} src={canvas_preview} alt='Canvas Preview' />
                        </CardContent>
                        <CardActions className={classes.actions} >
                            <Grid container justify="center" direction="column" spacing={8}>
                                <Typography>{canvas_name}</Typography>
                                <Typography variant="caption">{timeago().format(canvas_lastUpdate)}</Typography>
                            </Grid>
                            <IconButton
                                aria-label="More"
                                aria-owns={expanded ? "long-menu" : null}
                                aria-haspopup="true"
                                onClick={this.handleClick}
                            >
                                <MoreVertIcon style={{ color: "grey" }} />
                            </IconButton>
                            <Menu
                                id="long-menu"
                                anchorEl={anchorEl}
                                open={expanded}
                                onClose={this.handleClose}
                                PaperProps={{
                                    style: {
                                        width: 200,
                                        backgroundColor: "rgb(36, 40, 42)"
                                    }
                                }}
                            >
                                {["Settings", "Delete Canvas"].map(option => (
                                    <MenuItem
                                        key={option}
                                        className={classes.actions}
                                        onClick={() => this.handleClose(option)}
                                    >
                                        {option}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </CardActions>
                        <Dialog
                            open={this.state.deletePanelOpen}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={this.handleCancelDelete}
                            aria-labelledby="alert-dialog-slide-title"
                            aria-describedby="alert-dialog-slide-description"
                        >
                            <DialogTitle id="alert-dialog-slide-title">
                                {"Confirm Canvas Delete"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-slide-description">
                                    Are you sure you want to delete this canvas? <b>this action can not be undone</b>!
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleCancelDelete} color="default">
                                    Disagree
                                </Button>
                                <Button onClick={()=>this.handleConfirmDelete(canvas_id)} color="primary">
                                    Agree
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                ) : (
                        <CardContent style={{ height: "100%" }}>
                            <Button className={classes.ncButton} onClick={() => this.initiateCanvas('standard_canvas')} variant="outlined">
                                <Typography variant="headline" style={{ color: "grey" }}>
                                    Create new Canvas
                                </Typography>
                            </Button>
                            <Button className={classes.ncButton} onClick={() => this.initiateCanvas('lean_canvas')} variant="outlined">
                                <Typography variant="headline" style={{ color: "grey" }}>
                                    Create new Lean Canvas
              </Typography>
                            </Button>
                        </CardContent>
                    )}

            </Card>
        );
    }
}

Preview.propTypes = {
    classes: PropTypes.object.isRequired,
    isPreview: PropTypes.bool.isRequired,
};



export default withRouter(compose(
    withStyles(CanvasPreviewStyle),
    connect(mapStateToProps, mapDispatchToProps),
)(Preview));