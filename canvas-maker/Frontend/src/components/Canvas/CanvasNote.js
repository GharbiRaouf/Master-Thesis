import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import CircularProgress from "@material-ui/core/CircularProgress";
import green from "@material-ui/core/colors/green";
// import Fab from "@material-ui/core/Fab";
// import CheckIcon from "@material-ui/icons/Check";
import GavelIcon from "@material-ui/icons/Gavel";
import _ from "lodash";
import Pusher from 'pusher-js';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { compose } from 'redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/canvas';
import { API_URL } from "../../constants/utils.js";
import Axios from "axios";



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

const styles = theme => ({
    modalCard: {

        top: "30%",
        left: "40%"
    },
    pbroot: {
        display: "flex",
        alignItems: "center"
    },
    pbwrapper: {
        margin: theme.spacing.unit,
        position: "relative"
    },
    pbbuttonpbSuccess: {
        backgroundColor: green[500],
        "&:hover": {
            backgroundColor: green[700]
        }
    },
    pbfabProgress: {
        color: green[500],
        position: "absolute",
        top: -6,
        left: -6
    },
    pbbuttonProgress: {
        color: green[500],
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -12,
        marginLeft: -12
    },
    modalpaper: {
        position: "absolute",
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4
    },

    card: {
        minWidth: 100,
        marginBlockEnd: 5
    }
});

class CanvasNote extends React.Component {
    constructor(props) {
        super(props);
        this.handleNoteTextChange = this.handleNoteTextChange.bind(this);
        this.openNoteModal = this.openNoteModal.bind(this);
        this.handleDeleteNote = this.handleDeleteNote.bind(this);

    }
    componentDidMount() {
        var pusher = new Pusher('c2d71706fcd3133d8f57', {
            cluster: 'eu',
            forceTLS: true
          });
          
          
        var canvas_channel = pusher.subscribe('canvas');
        canvas_channel.bind('master_noticed_you', data => {
            if (data["note_id"]===this.props.Note_note_id){
            alert("Your Note Veridict was: "+JSON.stringify(data))
            if(data["veridict"]!= null)
            this.setState({
                pbloading: false,
                pbsuccess: true,
                ai_veridict: JSON.stringify(data)
            })}
        });
    }

    state = {
        name: "eaz",
        openNM: false,
        ai_veridict: -1,
        NotesCards: this.props.canvas ? this.props.canvas.canvas_notes ? this.props.canvas.canvas_notes : [] : [],

        note_headline_popper_anchor: null,
        note_description_popper_anchor: null,

        fetching_note_headline_rate: false,
        fetching_note_description_rate: false,

        received_note_headline_rate: false,
        received_note_description_rate: false,

        result_suggestion_for_headline: null,
        result_suggestion_for_description: null,
    };
    openNoteModal = event => {
        this.setState({
            pbloading: false,
            pbsuccess: false,
            openNM: !this.state.openNM
        });
    };
    handlepbButtonClick = () => {
        if (!this.state.pbloading) {
            this.setState(
                {
                    pbsuccess: false,
                    pbloading: true
                },
                () => {
                    Axios.post(API_URL + "qualify_headline", {
                        "group": this.props.location.pathname[1],
                        "note_content": this.props.Note,
                        "note_field": this.props.NoteField

                    })
                        .then((response) => {
                            console.log("ez",response["data"]);
                            // let R=response["data"]["quality"]["quality"] 
                            this.setState({
                                pbloading: false,
                                pbsuccess: true,
                                ai_veridict: JSON.stringify(response["data"])
                            });
                        });
                }
            );
        }
    };

    handleDeleteNote = () => {
        if (this.props.isShare) return;
        let index = this.props.Note;
        const { NotesCards } = this.state;
        let id = _.findIndex(NotesCards, { note_id: index });
        NotesCards.splice(id, 1);
        this.props.updateCanvas("canvas_notes", NotesCards)
        this.props.mustSaveCanvas()

        // this.setState({
        //   NotesCards
        // });
    };
    handleNoteTextChange = event => {
        if (this.props.isShare) return;
        
        if (this.props.isShare) return;
        const { NotesCards } = this.state;
        let fieldUpdate = event.target ? event.target.value : event
        for (var i in NotesCards) {
            if (NotesCards[i].note_id === this.props.Note.note_id) {
                NotesCards[i][event.target.id] = fieldUpdate;
                NotesCards[i]["note_author"] = this.props.userEmail
                break;
            }
        }
        this.props.updateCanvas("canvas_notes", NotesCards)
        this.props.mustSaveCanvas();
        // console.log(event.target);
        this.setState({
            [event.target.id]: event.target.value,
            ai_veridict: -1
        });
    };
    render() {
        const { classes, isShare } = this.props;
        const { pbloading, pbsuccess, ai_veridict } = this.state;
        const buttonClassname = classNames({
            [classes.pbbuttonpbSuccess]: pbsuccess || ai_veridict !== -1
        });

        return (
            <Card className={classes.card}>
                <CardContent>
                    <TextField
                        id="note_headline"
                        fullWidth
                        label="Headline"
                        value={this.state.note_headline}
                        onChange={this.handleNoteTextChange}
                        margin="normal"
                        variant="outlined"
                    />

                    <TextField
                        id="note_description"
                        multiline
                        fullWidth
                        label="Description"
                        value={this.state.note_description}
                        onChange={this.handleNoteTextChange}
                        margin="normal"
                        variant="outlined"
                    />
                </CardContent>
                {!isShare && <CardActions>
                    <Button size="small" onClick={this.openNoteModal}>
                        More Options
                    </Button>
                    <Button color="secondary" size="small" onClick={this.handleDeleteNote}>
                        Delete Note
                    </Button>
                </CardActions>}
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.openNM}
                    onClose={this.openNoteModal}
                    className={classes.modalCard}>

                    <CardContent>
                        <div style={{ maxWidth: "75%" }}>
                            <Card
                                className={classes.modalpaper}>
                                <CardContent>
                                    <Grid container zeroMinWidth>
                                        <Grid item xs={8} zeroMinWidth>
                                            <Typography color="primary" gutterBottom>
                                                Note Headline
                      </Typography>
                                            <Typography variant="subheading" component="h2" gutterBottom>
                                                {this.state.note_headline}
                                            </Typography>
                                            <Typography color="default">
                                                Note Description
                      </Typography>
                                            <Typography component="p" noWrap>
                                                {this.state.note_description}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={4} zeroMinWidth>

                                            <Typography variant="caption" gutterBottom>
                                                Submit your Headline to the AI
                      </Typography>
                                            <div className={classes.pbwrapper}>
                                                <Button variant="fab"
                                                    color="primary"
                                                    className={buttonClassname}
                                                    onClick={
                                                        (ai_veridict !== -1 && (() => { })) ||
                                                        (ai_veridict === -1 && this.handlepbButtonClick)
                                                    }
                                                >
                                                    {ai_veridict !== -1 ? (
                                                        <GavelIcon />
                                                    ) : (
                                                            <GavelIcon />
                                                        )}
                                                </Button>
                                                {pbloading && (
                                                    <CircularProgress
                                                        size={68}
                                                        className={classes.pbfabProgress}
                                                    />
                                                )}
                                            </div>

                                            <Typography variant="caption" gutterBottom>
                                                AI Veridict
                      </Typography>

                                            {ai_veridict !== -1 && <Typography variant="caption" gutterBottom>
                                                {
                                                    JSON.stringify(ai_veridict)
                                                }<br/>
                                                {ai_veridict["veridict"] >= 50 ? "Wonderful Content" :( ai_veridict["veridict"]  >= 25 ? "Needs More Enhancement" : "Poor Reduction...")}
                                            </Typography>}
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={this.openNoteModal}>
                                        Dismiss
                  </Button>
                                </CardActions>
                            </Card>
                        </div>
                    </CardContent>
                </Modal>
            </Card>
        );
    }
}



CanvasNote.propTypes = {
    classes: PropTypes.object.isRequired
};


export default withRouter(compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps),
)(CanvasNote));