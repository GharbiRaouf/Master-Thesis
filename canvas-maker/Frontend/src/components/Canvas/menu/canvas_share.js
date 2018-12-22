import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import DoneIcon from "@material-ui/icons/Done";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import CopyIcon from "@material-ui/icons/ContentCopy";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";

import { canvasShareStyles } from "../assets/canvasstyle";

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { compose } from 'redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/canvas';
import { FRONTEND_URL } from "../../../constants/utils";



function mapStateToProps(state) {
    return {
        token: state.auth.token,
        canvas: state.canvas.canvas,
        canvasMustSave: state.canvas.canvasMustSave,
        userEmail: state.auth.userEmail,
        isAuthenticated: state.auth.isAuthenticated,
        isSaving: state.canvas.isSaving
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

class CanvasDetails extends React.Component {
    state = {
        expanded: false,
        CanvasLink: this.props.canvas ?FRONTEND_URL+"share/"+this.props.canvas.canvas_id : "",
        copied: false
    };


    handleContentCopy = e => {
        var textField = document.createElement("textarea");
        textField.innerText = this.state.CanvasLink;
        document.body.appendChild(textField);
        textField.select();
        this.setState({
            copied: true
        });
        document.execCommand("copy");
        textField.remove();
    };

    handleMakeCanvasPublic = () => {
        const { isShareable,CanvasLink } = this.state
        this.setState({
            isShareable: !isShareable
        });

        this.props.mustSaveCanvas()
        this.props.updateCanvas("canvas_shared", isShareable&& CanvasLink)
    }

    render() {
        const { classes } = this.props;
        const { isShareable, CanvasLink, copied } = this.state

        return (
            <Paper elevation={0} className={classes.card}>
                <Typography variant="display1">Canvas Share</Typography>
                <Typography variant="caption">
                    First Make this Canvas Public
                    <Switch
                        checked={isShareable}
                        onChange={this.handleMakeCanvasPublic}
                        value="checkedB"
                        color="primary"
                    />{" "}
                </Typography>

                <Grid container spacing={8}>
                    <Grid item xs={12}>
                        <Typography variant="caption">Then Copy this link</Typography>

                        <Input
                            disabled={!isShareable}
                            fullWidth
                            readOnly
                            value={CanvasLink}
                            placeholder="Tags"
                            id="teams"
                            className={classes.input}
                            inputProps={{
                                "aria-label": "Description"
                            }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton disabled={!isShareable} onClick={this.handleContentCopy}>
                                        {copied ? <DoneIcon /> : <CopyIcon />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

CanvasDetails.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withRouter(compose(
    withStyles(canvasShareStyles),
    connect(mapStateToProps, mapDispatchToProps),
)(CanvasDetails));