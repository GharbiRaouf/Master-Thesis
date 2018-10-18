import React from "react";
import PropTypes from "prop-types";

//Material imports
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import CardActions from "@material-ui/core/CardActions";
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import DeleteIcon from "@material-ui/icons/Delete";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import { Popper, Chip, Avatar } from "@material-ui/core"
import SearchIcon from "@material-ui/icons/Search";
import DoneIcon from "@material-ui/icons/Done";
import { Typography } from "@material-ui/core";


//Misc
import { BeautifulColors, CanvasModelStyles } from "./assets/canvasstyle.jsx"
import _ from "lodash";

import timeago from "timeago.js";
import Axios from "axios";

//redux
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { compose } from 'redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/canvas';

const Channel_Suggestions = [
    {
        "headline": "Social Media - Facebook",
        "description": "Our Company  Facebook Page",
    },
    {
        "headline": "Webpage ",
        "description": "Our Company Page and our Ads ",
    },
    {
        "headline": "E-mail Marketing",
        "description": "Sending Email to customers",
    }
]

// const suggestion = {
//     "note_headline": "Something better",
//     "note_description": "Better description"
// }
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


export class CanvasNote extends React.Component {
    state = {
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
    format_response = (result_suggestion_for_headline) => {
        const { NoteField } = this.props
        var judgement = result_suggestion_for_headline[0]
        var rating = (Number(result_suggestion_for_headline[1])).toFixed(2);
        // console.log(NoteField,judgement,rating,(NoteField.indexOf("Problem") >= 0),(rating >= 50) );

        var result = (judgement === "green" ? "This is a good Note. " : "This needs adjustment. ") + '[ rating:' + rating + "% ]";
        if (NoteField.indexOf("Problem") >= 0) { result += rating >= 50 ? "" : " [This may not be an appropriate Problem Statement] " }
        else result += rating >= 50 ? " [This may be an appropriate Solution Statement] " : ""
        return result
    }

    handle_open_headline_popper = (event, isSmart, isChannel) => {
        if (this.props.isShare) return;
        if ((isSmart) || (isChannel))
            this.setState({
                note_headline_popper_anchor: event.currentTarget,
                fetching_note_headline_rate: false,
                received_note_headline_rate: false,
                result_suggestion_for_headline: null,

            })
    }

    handle_open_description_popper = (event, isSmart, isChannel) => {
        if (this.props.isShare) return;
        if ((isSmart) || (isChannel))
            this.setState({
                note_description_popper_anchor: event.currentTarget,
                fetching_note_description_rate: false,
                received_note_description_rate: false,
                result_suggestion_for_description: null,
            })
    }

    handle_close_headline_popper = () => {
        if (this.props.isShare) return;
        this.setState({
            note_headline_popper_anchor: null,
            fetching_note_headline_rate: false,
            received_note_headline_rate: false,
            result_suggestion_for_headline: this.props.Note.note_color
        })
    }

    handle_close_description_popper = () => {
        if (this.props.isShare) return;
        this.setState({
            note_description_popper_anchor: null,
            fetching_note_description_rate: false,
            received_note_description_rate: false,
            result_suggestion_for_description: ""
        })
    }

    handle_confirm_headline_suggestion = (isChannel) => {
        if (this.props.isShare) return;
        if (isChannel) this.handleNoteDescriptionChange(this.props.Note.note_id, "note_headline", this.state.result_suggestion_for_headline);
        this.handle_close_headline_popper();
    }

    handle_confirm_description_suggestion = () => {
        if (this.props.isShare) return;
        this.handleNoteDescriptionChange(this.props.Note.note_id, "note_description", this.state.result_suggestion_for_description);
        this.handle_close_description_popper();
    }

    start_enhancing_headline_field = (isChannel) => {
        if (this.props.isShare) return;
        this.setState({
            fetching_note_headline_rate: true,
            received_note_headline_rate: false,
            result_suggestion_for_headline: this.props.Note.note_color

        })
        if (isChannel) {
            var index = Math.floor(Math.random() * Channel_Suggestions.length);
            this.setState({
                fetching_note_headline_rate: false,
                received_note_headline_rate: true,
                result_suggestion_for_headline: Channel_Suggestions[index].headline,
            })

            return;
        }
        Axios.post("/api/v1/qualify_headline", {
            text_to_enhance: this.props.Note.note_headline
        }).then(response => {
            this.setState({
                fetching_note_headline_rate: false,
                received_note_headline_rate: true,
                result_suggestion_for_headline: response.data.quality.quality,
            })
        })
    }
    start_enhancing_description_field = (isChannel) => {
        // console.log(this.props.NoteField);

        if (this.props.isShare) return;
        this.setState({
            fetching_note_description_rate: true,
            received_note_description_rate: false,
            result_suggestion_for_description: this.props.Note.note_color

        })
        if (isChannel) {
            var index = Math.floor(Math.random() * Channel_Suggestions.length);
            this.setState({
                fetching_note_description_rate: false,
                received_note_description_rate: true,
                result_suggestion_for_description: Channel_Suggestions[index].description,
            })

            return;
        }
        //API CALL
        Axios.post("/api/v1/optimize_text", {
            // "canvas_field": field,
            "canvas_field": this.props.NoteField
        }).then(response => {
            this.setState({
                fetching_note_description_rate: false,
                received_note_description_rate: true,
                result_suggestion_for_description: response.data.suggestions,

            })
        })

    }

    //#region Notes Functions
    handleNoteDescriptionChange = (id, field, event) => {
        if (this.props.isShare) return;
        const { NotesCards } = this.state;
        let fieldUpdate = event.target ? event.target.value : event
        for (var i in NotesCards) {
            if (NotesCards[i].note_id === id) {
                NotesCards[i][field] = fieldUpdate;

                break;
            }
        }
        this.props.updateCanvas("canvas_notes", NotesCards)
        this.props.mustSaveCanvas();
        // if (field === "note_headline") this.setState({
        //     note_headline_popper_anchor: event.currentTarget
        // })
        // if (field === "note_description") this.setState({
        //     note_description_popper_anchor: event.currentTarget
        // })
    };
    handleDeleteNote = index => {
        if (this.props.isShare) return;
        const { NotesCards } = this.state;
        let id = _.findIndex(NotesCards, { note_id: index });
        NotesCards.splice(id, 1);
        this.props.updateCanvas("canvas_notes", NotesCards)
        this.props.mustSaveCanvas()

        // this.setState({
        //   NotesCards
        // });
    };
    handleExpandColorsClick = (id, event) => {
        if (this.props.isShare) return;
        const { NotesCards } = this.state;
        for (var i in NotesCards) {
            if (NotesCards[i].note_id === id) {
                NotesCards[i].expanded = !Boolean(NotesCards[i].expanded);
                break;
            }
        }
        // this.props.updateCanvas("canvas_notes", NotesCards)
        this.setState({
            colorsButtonAnchor: event ? event.currentTarget : null,
            // NotesCards
        });
    };
    handleExpandInfoClick = (id, event) => {
        if (this.props.isShare) return;
        const { NotesCards } = this.state;
        for (var i in NotesCards) {
            if (NotesCards[i].note_id === id) {
                NotesCards[i].note_info_expanded = !Boolean(NotesCards[i].note_info_expanded);
                break;
            }
        }
        this.props.updateCanvas("canvas_notes", NotesCards)
        this.setState({
            infoAnchorEl: event ? event.currentTarget : null,
            // NotesCards
        });
    };
    handleNoteColorChange(item, color) {
        const { NotesCards } = this.state;
        for (var i in NotesCards) {
            if (NotesCards[i].note_id === item) {
                NotesCards[i].note_color = color;
                NotesCards[i].expanded = !Boolean(NotesCards[i].expanded);
                break;
            }
        }
        this.props.mustSaveCanvas()
        this.props.updateCanvas("canvas_notes", NotesCards)
        this.setState({
            colorsButtonAnchor: null,
            // NotesCards
        });
    }
    //#endregion Notes Functions


    render() {
        const {
            colorsButtonAnchor,
            infoAnchorEl,
            note_headline_popper_anchor,
            note_description_popper_anchor,
            received_note_headline_rate,
            received_note_description_rate,
            result_suggestion_for_headline,
            result_suggestion_for_description, } = this.state;

        const { Note, classes, isSmart } = this.props
        const isChannel = this.props.NoteField ? this.props.NoteField.indexOf("Channel") >= 0 : false;
        return (
            <div>
                <Paper
                    className={classes.paper}
                    style={{
                        backgroundColor: Note.note_color,
                        borderStyle: "solid",
                        borderColor: Boolean(result_suggestion_for_headline) ? result_suggestion_for_headline[0] : Note.note_color
                    }}
                >
                    <Input
                        disabled={this.props.isShare}
                        type="text"
                        style={{ overflowY: "hidden" }}
                        disableUnderline={true}
                        fullWidth
                        value={Note.note_headline}
                        placeholder="Note headline"

                        onClick={(e) => this.handle_open_headline_popper(e, isSmart, isChannel)}
                        onChange={event =>
                            this.handleNoteDescriptionChange(
                                Note.note_id,
                                "note_headline",
                                event
                            )
                        }
                    />
                    <Input
                        disabled={this.props.isShare}
                        value={Note.note_description}
                        fullWidth
                        onClick={(e) => this.handle_open_description_popper(e, isSmart, isChannel)}
                        className={classes.resize}
                        placeholder="Note Description"
                        multiline
                        onChange={event =>
                            this.handleNoteDescriptionChange(
                                Note.note_id,
                                "note_description",
                                event
                            )
                        }
                    />
                    <CardActions
                        className={classes.actions}
                        disableActionSpacing
                    >
                        <IconButton
                            aria-label="ColorLens"
                            onClick={event =>
                                this.handleExpandColorsClick(Note.note_id, event)
                            }
                        >
                            <ColorLensIcon />
                        </IconButton>

                        <IconButton
                            aria-label="ColorLens"
                            onClick={(event) =>
                                this.handleExpandInfoClick(Note.note_id, event)
                            }
                        >
                            <InfoIcon />
                        </IconButton>
                        <IconButton
                            onClick={() =>
                                this.handleDeleteNote(Note.note_id)
                            }
                            className={classes.expand}
                            aria-label="Add to Deletes"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </CardActions>
                    <Popover
                        anchorEl={infoAnchorEl}
                        open={Boolean(Note.note_info_expanded)}
                        onClose={() => this.handleExpandInfoClick(Note.note_id, null)}
                    >
                        <div
                            style={{ width: "100%", padding: 10 }}
                        >

                            <Typography variant="caption"> Made By {Note.note_author}</Typography>
                            <Typography variant="caption"> Last Edited :{timeago().format(Note.note_lastEdited)}</Typography>
                        </div>
                    </Popover>
                    <Popover
                        anchorEl={colorsButtonAnchor}
                        style={{ width: "100%" }}
                        open={Boolean(Note.expanded)}
                        onClose={() => this.handleExpandColorsClick(Note.note_id, null)}
                    >
                        <div style={{ width: "100%", padding: 10 }}
                        >

                            {BeautifulColors.map(e => {
                                if (this.props.isShare) return null;
                                return (
                                    <Button
                                        mini
                                        key={e}
                                        style={{
                                            backgroundColor: e,
                                            maxHeight: "10px",
                                            maxWidth: "10px"
                                        }}
                                        onClick={() =>
                                            this.handleNoteColorChange(
                                                Note.note_id,
                                                e
                                            )
                                        }
                                    >

                                    </Button>
                                );
                            })}
                        </div>
                    </Popover>
                </Paper>
                <Popper
                    style={{ maxWidth: 150, zIndex: 2000 }}
                    placement="right"
                    disablePortal={true}
                    modifiers={{
                        flip: {
                            enabled: true
                        },
                        preventOverflow: {
                            enabled: false,
                            boundariesElement: "scrollParent"
                        },
                        arrow: {
                            enabled: true,
                            element: "arrowRef"
                        }
                    }}
                    open={Boolean(note_headline_popper_anchor)}
                    anchorEl={note_headline_popper_anchor}
                >
                    {
                        // note_headline_popper_anchor
                        // fetching_note_headline_rate
                        // received_note_headline_rate
                        // result_suggestion_for_headline
                    }
                    {isChannel ?
                        <Chip
                            color="secondary"
                            onDelete={received_note_headline_rate ? this.handle_confirm_headline_suggestion : () => this.start_enhancing_headline_field(isChannel)}
                            deleteIcon={<IconButton>{received_note_headline_rate ? <DoneIcon /> : <SearchIcon />}</IconButton>}
                            avatar={<Avatar><CloseIcon onClick={this.handle_close_headline_popper} /></Avatar>}
                            label={!received_note_headline_rate ? "Do you want some Suggestions?" : result_suggestion_for_headline}
                        />
                        : <Chip
                            color="secondary"
                            onDelete={received_note_headline_rate ? () => this.handle_confirm_headline_suggestion(isChannel) : () => this.start_enhancing_headline_field(isChannel)}
                            deleteIcon={<IconButton>{received_note_headline_rate ? <DoneIcon /> : <SearchIcon />}</IconButton>}
                            avatar={<Avatar><CloseIcon onClick={this.handle_close_headline_popper} /></Avatar>}
                            label={!received_note_headline_rate ? "Do you want to verify this?" : this.format_response(result_suggestion_for_headline)}
                        />
                    }


                </Popper>
                <Popper
                    style={{ maxWidth: 150, zIndex: 2000 }}
                    placement="right"
                    disablePortal={true}
                    modifiers={{
                        flip: {
                            enabled: true
                        },
                        preventOverflow: {
                            enabled: false,
                            boundariesElement: "scrollParent"
                        },
                        arrow: {
                            enabled: true,
                            element: "arrowRef"
                        }
                    }}
                    open={Boolean(note_description_popper_anchor)}
                    anchorEl={note_description_popper_anchor}
                >
                    {
                        // note_description_popper_anchor
                        // fetching_note_description_rate
                        // received_note_description_rate
                        // result_suggestion_for_description
                    }
                    <Chip
                        color="primary"
                        onDelete={received_note_description_rate ? this.handle_confirm_description_suggestion : () => this.start_enhancing_description_field(isChannel)}
                        deleteIcon={<IconButton>{received_note_description_rate ? <DoneIcon /> : <SearchIcon />}</IconButton>}
                        avatar={<Avatar><CloseIcon onClick={this.handle_close_description_popper} /></Avatar>}
                        label={!received_note_description_rate ? "Do you want to try an AI suggestion?" : (result_suggestion_for_description)}
                    />


                </Popper>

            </div>
        )
    }
}


CanvasNote.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withRouter(compose(
    withStyles(CanvasModelStyles),
    connect(mapStateToProps, mapDispatchToProps),
)(CanvasNote));