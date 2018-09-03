import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Popover from "@material-ui/core/Popover";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import red from "@material-ui/core/colors/red";
import DeleteIcon from "@material-ui/icons/Delete";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import InfoIcon from "@material-ui/icons/Info";
import AddIcon from "@material-ui/icons/Add";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import _ from "lodash";
import canvas_style from "../../constants/canvasdesign";
import NotesCards from "./example";
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { compose } from 'redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/canvas';
import { InputLabel, FormControl, TextField, Typography } from "@material-ui/core";
import { BeautifulColors, CanvasModelStyles } from "./assets/canvasstyle.jsx"
import CircularProgress from '@material-ui/core/CircularProgress';
import html2canvas from 'html2canvas';

import {
  reorder,
  switchColumn,
  getDroppableStyle,
  getItemStyle,
} from "./utils/dnd_func.js"
import timeago from "timeago.js";


const nanoid = require('nanoid');

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
const makeCanvas = () => {
  return html2canvas(document.querySelector("#preview_canvas")).then(canvas => {
    var extra_canvas = document.createElement("canvas");
    extra_canvas.setAttribute("width", 160);
    extra_canvas.setAttribute("height", 90);
    var ctx = extra_canvas.getContext("2d");
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 320, 180);
    var dataURL = extra_canvas.toDataURL("image/png");
    return dataURL
  });
};

class Designer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      NotesCards: props.canvas ? props.canvas.canvas_notes ? props.canvas.canvas_notes : [] : []
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }
  componentDidMount() {
    console.log(this.props.match.params.canvas_id, "awesome");
  }
  dispatchNewRoute(route) {
    this.props.changePage(route)
  }
  handleAddNote = note_position => {
    const { NotesCards } = this.state;
    NotesCards.push({
      note_id: nanoid(),
      note_author: this.props.userEmail,
      note_color: "#ffeb3b",
      note_description: "",
      note_headline: "",
      note_lastEdited: Date.now(),
      note_position: note_position,
      note_questionNumber: "",
      note_status: "new",
    });
    this.props.updateCanvas("canvas_notes", NotesCards)
    this.props.mustSaveCanvas()

  };
  onDragEnd(result) {

    let NotesCards;
    if (
      !result.destination ||
      (result.source === result.destination &&
        result.source.index === result.destination.index)
    ) {
      return;
    }
    if (result.source.droppableId === result.destination.droppableId) {

      NotesCards = Array.from(this.state.NotesCards)
      let sourceDrop = _.filter(NotesCards, { note_position: result.source.droppableId })
      const [lovelyItem] = sourceDrop.splice(result.source.index, 1)
      sourceDrop.splice(result.destination.index, 0, lovelyItem)


    } else {
      NotesCards = Array.from(this.state.NotesCards)
      let sourceDrop = _.filter(NotesCards, { note_position: result.source.droppableId })
      let destinDrop = _.filter(NotesCards, { note_position: result.destination.droppableId })
      const [lovelyItem] = sourceDrop.splice(result.source.index, 1)
      lovelyItem.note_position = result.destination.droppableId
      destinDrop.splice(result.destination.index, 0, lovelyItem)


    }
    this.props.mustSaveCanvas()
    this.props.updateCanvas("canvas_notes", this.state.NotesCards)
    console.log(result, NotesCards, this.state.NotesCards);
    // this.setState({
    //   NotesCards
    // });
  }

  handleNoteDescriptionChange = (id, field, event) => {
    const { NotesCards } = this.state;
    for (var i in NotesCards) {
      if (NotesCards[i].note_id === id) {
        NotesCards[i][field] = event.target.value;

        break;
      }
    }
    this.props.updateCanvas("canvas_notes", NotesCards)
    this.props.mustSaveCanvas()

    // this.setState({
    //   NotesCards
    // });
  };

  handleDeleteNote = index => {
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
    const { NotesCards } = this.state;
    for (var i in NotesCards) {
      if (NotesCards[i].note_id === id) {
        NotesCards[i].expanded = !Boolean(NotesCards[i].expanded);

        break;
      }
    }
    this.props.updateCanvas("canvas_notes", NotesCards)
    this.setState({
      anchorEl: event?event.currentTarget:null,
      // NotesCards
    });
  };

  handleExpandInfoClick = (id, event) => {
    const { NotesCards } = this.state;
    for (var i in NotesCards) {
      if (NotesCards[i].note_id === id) {
        NotesCards[i].note_info_expanded = !Boolean(NotesCards[i].note_info_expanded);

        break;
      }
    }
    this.props.updateCanvas("canvas_notes", NotesCards)
    this.setState({
      infoAnchorEl: event?event.currentTarget:null,
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
      anchorEl: null,
      // NotesCards
    });
  }
  handleCanvasDescriptionChange = (event, field) => {
    const newdata = event.target.value;
    this.props.mustSaveCanvas()
    this.props.updateCanvas(field, newdata)
  }

  updateMyCanvas = () => {
    makeCanvas().then(dataURL => {
      this.props.updateAndSaveCanvas(this.props.canvas, dataURL, this.props.token)

    })
  }
  render() {
    const { classes, canvas } = this.props;
    const { anchorEl, NotesCards, infoAnchorEl } = this.state;
    const NoteColumn = column => (
      <Grid
        style={{
          padding: "10px",
          height: column.isCompound ? "100%" : "",
          display: "grid"
        }}
        item
        key={column.id}
        xs={column.width}
      >
        <Card className={classes.card}>
          <CardHeader
            action={
              <IconButton
                onClick={() => {
                  this.handleAddNote(column.category);
                }}
              >
                <AddIcon />
              </IconButton>
            }
          />
          <CardContent style={{ padding: 2, height: "100%" }}>
            <Droppable droppableId={column.category}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getDroppableStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {/* {provided.placeholder} */}
                  {_
                    .filter(NotesCards, { note_position: column.category })
                    .map((element, index) => (
                      <Draggable
                        key={element.note_id}
                        draggableId={element.note_id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            style={getItemStyle(
                              provided.draggableProps.style,
                              snapshot.isDragging
                            )}
                            key={element.note_id}
                            className={classes.paper}
                          >
                            {console.log(NotesCards)}
                            <Paper
                              className={classes.paper}
                              style={{ backgroundColor: element.note_color }}
                            >
                              <Input
                                type="text"
                                style={{ overflowY: "hidden" }}
                                disableUnderline={true}
                                fullWidth
                                value={element.note_headline}
                                placeholder="Note headline"
                                onChange={event =>
                                  this.handleNoteDescriptionChange(
                                    element.note_id,
                                    "note_headline",
                                    event
                                  )
                                }
                              />
                              <Input
                                value={element.note_description}
                                fullWidth
                                className={classes.resize}
                                placeholder="Note Description"
                                multiline
                                onChange={event =>
                                  this.handleNoteDescriptionChange(
                                    element.note_id,
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
                                    this.handleExpandColorsClick(element.note_id, event)
                                  }
                                >
                                  <ColorLensIcon />
                                </IconButton>

                                <IconButton
                                  aria-label="ColorLens"
                                  onClick={(event) =>
                                    this.handleExpandInfoClick(element.note_id, event)
                                  }
                                >
                                  <InfoIcon />
                                </IconButton>
                                <IconButton
                                  onClick={() =>
                                    this.handleDeleteNote(element.note_id)
                                  }
                                  className={classes.expand}
                                  aria-label="Add to Deletes"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </CardActions>
                              <Popover
                                anchorEl={infoAnchorEl}
                                open={Boolean(element.note_info_expanded)}
                                onClose={() => this.handleExpandInfoClick(element.note_id, null)}
                              >
                                <div
                                  style={{ width: "100%", padding: 10 }}
                                >

                                  <Typography variant="caption"> Made By {element.note_author}</Typography>
                                  <Typography variant="caption"> Last Edited :{timeago().format(element.note_lastEdited)}</Typography>
                                </div>
                              </Popover>
                              <Popover
                                anchorEl={anchorEl}
                                style={{ width: "100%" }}
                                open={Boolean(element.expanded)}
                                onClose={() => this.handleExpandColorsClick(element.note_id, null)}

                              >
                              <div style={{ width: "100%", padding: 10 }}
>

                                {BeautifulColors.map(e => {
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
                                          element.note_id,
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
                          </div>
                        )}
                      </Draggable>
                    ))}
                </div>
              )}
            </Droppable>
          </CardContent>
        </Card>
      </Grid>
    );
    return (
      <div id="preview_canvas">
        {!canvas && <Typography >No Canvas to display! Select one from your Dashboard</Typography>}
        {canvas &&
          <Grid container style={{ backgroundColor: "#4ebdd4", padding: "5px" }}>
            <Grid item xs={12}>

              <FormControl>
                <InputLabel htmlFor="canvas_name">Project Name</InputLabel>
                <Input
                  value={canvas.canvas_name}
                  id="canvas_name"
                  className={classes.input}
                  onChange={(e) => this.handleCanvasDescriptionChange(e, "canvas_name")}
                  inputProps={{
                    'aria-label': 'Description',
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>

              <FormControl fullWidth>
                <InputLabel htmlFor="canvas_description">Project Name</InputLabel>
                <Input
                  value={canvas.canvas_description}
                  id="canvas_description"
                  className={classes.input}
                  onChange={(e) => this.handleCanvasDescriptionChange(e, "canvas_description")}
                  inputProps={{
                    'aria-label': 'Description',
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>}
        {canvas &&
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Grid container alignItems="stretch">
              {canvas_style[canvas.canvas_type].map(column => {
                if (!column.isCompound) return NoteColumn(column);
                else
                  return (
                    <Grid key={column.id} item xs={2} container>
                      {column.items.map(subCol => {
                        return (
                          <div style={{ width: "100%" }} key={subCol.id}>
                            {NoteColumn(subCol)}
                          </div>
                        );
                      })}
                    </Grid>
                  );
              })}
            </Grid>
          </DragDropContext>
        }
        {
          this.props.canvasMustSave &&
          <Button variant="fab" className={classes.fab} color="primary" onClick={() => this.updateMyCanvas()}>
            {this.props.isSaving ? <CircularProgress /> : <AddIcon />}
          </Button>
        }
      </div>
    );
  }
}

Designer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(compose(
  withStyles(CanvasModelStyles),
  connect(mapStateToProps, mapDispatchToProps),
)(Designer));