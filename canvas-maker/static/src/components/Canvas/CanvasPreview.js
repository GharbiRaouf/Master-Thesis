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
import red from "@material-ui/core/colors/red";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import timeago from 'timeago.js';

import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { compose } from 'redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/canvas';

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        userEmail: state.auth.userEmail,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ...actionCreators, changePage: path => push(path)
    }, dispatch);
}


const styles = theme => ({
    card: {
        maxWidth: 400,
        height: "100%",
        backgroundColor: "rgb(25, 30, 35)"
    },
    media: {
        height: "100%",
        paddingTop: "50%" // 16:9
    },
    actions: {
        textFillColor: "grey",
        display: "flex",
        bottom: "0",
        backgroundColor: "rgb(36, 40, 42)"
    },
    expand: {
        transform: "rotate(0deg)",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest
        }),
        marginLeft: "auto",
        [theme.breakpoints.up("sm")]: {
            marginRight: -8
        }
    },
    expandOpen: {
        transform: "rotate(180deg)"
    },
    avatar: {
        backgroundColor: red[500]
    },
    actiontext: {
        width: "100%"
    },
    ncButton: {
        width: "100%",
        height: "40%",
        position: "relative",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        marginTop: "2%",
        borderColor: "grey"
    }
});
class Preview extends React.Component {
    state = {
        anchorEl: null
    };

    dispatchNewRoute(route) {
        this.props.changePage(route)
    }


    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };
    setCanvas = (canvas_id) => {
        this.props.setCanvasToEdit(canvas_id, this.props.token)
        this.props.changePage("/designer")

    }


    render() {
        const { classes, isPreview, canvas_preview, canvas_name, canvas_lastUpdate,canvas_id } = this.props;
        const { anchorEl } = this.state;
        const expanded = !!anchorEl;
        return (
            <Card className={classes.card}>
                {isPreview ? (
                    <div>
                        <CardContent onClick={() => this.setCanvas(canvas_id)} >
                            <CardMedia className={classes.media} image={<img src={canvas_preview} />} />
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
                                        onClick={this.handleClose}
                                    >
                                        {option}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </CardActions>
                    </div>
                ) : (
                        <CardContent style={{ height: "100%" }}>
                            <Button className={classes.ncButton} onClick={() => this.dispatchNewRoute('/designer')} variant="outlined">
                                <Typography variant="headline" style={{ color: "grey" }}>
                                    Create new Canvas
                                </Typography>
                            </Button>
                            <Button disabled={true} className={classes.ncButton} variant="outlined">
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
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps),
)(Preview));