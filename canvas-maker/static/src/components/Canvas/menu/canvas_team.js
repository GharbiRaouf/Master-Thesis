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
import HowToRegIcon from "@material-ui/icons/ThumbUp";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import Grid from "@material-ui/core/Grid";

import { canvasTeamStyles } from "../assets/canvasstyle";

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { compose } from 'redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../../actions/canvas';
import { SERVER_URL } from "../../../constants/utils";



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
    state = { newTeamMate:"" };
    handleCanvasDescriptionChange = (event, field) => {
        if(this.props.isShare) return;
        let newdata = ''
        if (field === "canvas_team") {
          newdata = Array.from(this.props.canvas.canvas_team)
          newdata.push({ "user": event, "role": "partner" })
          this.setState({
            newTeamMate: ""
          })
        }
        else newdata = event.target.value;
        this.props.mustSaveCanvas()
        this.props.updateCanvas(field, newdata)
      }
    
    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };

    render() {
        const { classes } = this.props;

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
                    <Grid item xs={12} spacing={8}>
                        <List dense>
                            {this.props.canvas.canvas_team.map((member, index) => {
                                return (
                                    <ListItem
                                        key={index}
                                        dense
                                        button
                                        className={classes.listItem}
                                    >
                                        <Avatar>{member.role[0]}</Avatar>
                                        <ListItemText primary={member.user} />

                                        <ListItemSecondaryAction>
                                            <IconButton aria-label="Delete">
                                                <HowToRegIcon />
                                            </IconButton>
                                            <IconButton aria-label="Delete">
                                                <CloseIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
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