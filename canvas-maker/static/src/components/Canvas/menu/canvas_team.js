import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Input from "@material-ui/core/Input";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import Grid from "@material-ui/core/Grid";
import Tooltip from '@material-ui/core/Tooltip';

import { canvasTeamStyles } from "../assets/canvasstyle";

import _ from "lodash"

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { compose } from 'redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/canvas';



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
    state = { newTeamMate: "" };
    handleCanvasDescriptionChange = (event, field) => {
        if (this.props.isShare) return;
        let newdata = ''
        if (field === "canvas_team") {
            newdata = Array.from(this.props.canvas.canvas_team)
            newdata.push({ "user": event, "role": "partner" })
            this.setState({
                newTeamMate: ""
            })
        }
        this.props.mustSaveCanvas()
        this.props.updateCanvas(field, newdata)
    }

    handleSecondaryAction = (action, index) => {
        let newMemberShip = Array.from(this.props.canvas.canvas_team)
        console.log(newMemberShip, action, index);

        if (action === "Make_Admin") newMemberShip[index].role = "creator"
        if (action === "Make_Partner") newMemberShip[index].role = "partner"
        if (action === "Remove_Partner") newMemberShip.splice(index, 1)

        this.props.updateCanvas("canvas_team", newMemberShip)
        this.props.mustSaveCanvas()

    }
    render() {
        const { classes } = this.props;
        const isCreator = _.findIndex(this.props.canvas.canvas_team, { 'role': 'creator', 'user': this.props.userEmail }) > -1
        return (
            <Paper elevation={0} className={classes.card}>
                <Typography variant="display1">Canvas Team</Typography>
                <Grid container spacing={8}>
                    <Grid item xs={12}>
                        <Input
                            fullWidth
                            value={this.state.newTeamMate}
                            placeholder="Add another Team"
                            id="teams"
                            className={classes.input}
                            onChange={e => this.setState({ newTeamMate: e.target.value })}
                            inputProps={{
                                "aria-label": "Description"
                            }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() =>
                                            this.handleCanvasDescriptionChange(
                                                this.state.newTeamMate,
                                                "canvas_team"
                                            )
                                        }
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <List component="nav">
                            {this.props.canvas.canvas_team.map((member, index) => {
                                return (
                                    <ListItem
                                        key={index}
                                        dense
                                        button
                                        className={classes.listItem}
                                    >
                                        <Tooltip title={"Role: "+_.startCase(member.role)+"\n"}>
                                        <Avatar>{member.role[0]}</Avatar>
                                        </Tooltip>

                                        <ListItemText style={{ minWidth: "70%" }} primary={member.user} />
                                        {(isCreator && this.props.userEmail !== member.user) &&
                                            <ListItemSecondaryAction>
                                                {_.lowerCase(member.role) === "creator" ?
                                                    <Tooltip title="Make Admin">
                                                        <IconButton onClick={() => this.handleSecondaryAction("Make_Partner", index)}>
                                                            <StarIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    :
                                                    <Tooltip title="Make Member">
                                                        <IconButton onClick={() => this.handleSecondaryAction("Make_Admin", index)}>
                                                            <StarBorderIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                }
                                                <Tooltip title="Remove Partner">

                                                    <IconButton onClick={() => this.handleSecondaryAction("Remove_Partner", index)}>
                                                        <CloseIcon />
                                                    </IconButton>
                                                </Tooltip>

                                            </ListItemSecondaryAction>}
                                    </ListItem>
                                );
                            })}
                        </List>
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
    withStyles(canvasTeamStyles),
    connect(mapStateToProps, mapDispatchToProps),
)(CanvasDetails));