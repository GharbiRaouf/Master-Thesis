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
import AddIcon from "@material-ui/icons/Add";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import _ from "lodash";
import canvas_style from "../../constants/canvasdesign";
import { NotesCards } from "./example";

import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { compose } from 'redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/auth';
import { InputLabel, FormControl } from "@material-ui/core";

function mapStateToProps(state) {
  return {
    token: state.auth.token,
    userName: state.auth.userName,
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
    minWidth: "18%",
    backgroundColor: "#e2e2e2",
    margin: 0,
    padding: 0
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  actions: {
    display: "flex",
    margin: 0,
    position: "relative",
    bottom: "0",
    padding: 0,
    marginBottom: "-1%"
  },
  expand: {
    marginLeft: "auto",
    color: "red"
  },
  avatar: {
    backgroundColor: red[500]
  }
});
const BeautifulColors = [
  "#f44336",
  "#9c27b0",
  "#3f51b5",
  "#2196f3",
  "#00bcd4",
  "#009688",
  "#ffeb3b",
  "#ff9800"
];

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const switchColumn = (
  startList,
  startIndex,
  endList,
  endIndex,
  newCategory
) => {
  const startResult = Array.from(startList);
  const endResult = Array.from(endList);
  const [removed] = startResult.splice(startIndex, 1);
  removed.category = newCategory;
  endResult.splice(endIndex, 0, removed);
  return [startResult, endResult];
};

const getDroppableStyle = isDraggingOver => ({
  background: isDraggingOver ? "darkgrey" : "lightgrey",
  height: "100%",
  minHeight: "100px",
  padding: "10px 0px 10px 0px"
});

const getItemStyle = (draggableStyle, isDragging) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: 0,
  margin: `0 0 0px 0`,
  filter: isDragging ? "blur(1px)" : "none",

  // styles we need to apply on draggables
  ...draggableStyle
});

const filterByCategory = (arr, cat) => {
  return _.filter(arr, { category: cat });
};

class Designer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      NotesCards: NotesCards
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }
  dispatchNewRoute(route) {
    this.props.changePage(route)
  }
  handleAddNote = category => {
    const { NotesCards } = this.state;
    NotesCards.push({
      id: Date.now().toString(),
      color: "#ffeb3b",
      headline: "",
      description: "",
      author: "",
      lastEdited: "12/01/2018 10:00",
      category: category,
      status: "new",
      expanded: false
    });
    this.setState({
      NotesCards
    });
  };
  onDragEnd(result) {
    // dropped outside the list
    if (
      !result.destination ||
      (result.source === result.destination &&
        result.source.index === result.destination.index)
    ) {
      return;
    }
    if (result.source.droppableId === result.destination.droppableId) {
      const NotesCards = reorder(
        this.state.NotesCards,
        result.source.index,
        result.destination.index
      );
    } else {
      const { NotesCards } = this.state;
      let sId = result.source.droppableId,
        dId = result.destination.droppableId;
      switchColumn(
        _.filter(NotesCards, { category: sId }),
        result.source.index,
        _.filter(NotesCards, { category: dId }),
        result.destination.index,
        dId
      );
    }

    this.setState({
      NotesCards
    });
  }

  handleNoteDescriptionChange = (id, field, event) => {
    const { NotesCards } = this.state;
    for (var i in NotesCards) {
      if (NotesCards[i].note_id === id) {
        NotesCards[i][field] = event.target.value;

        break;
      }
    }
    this.setState({
      NotesCards
    });
  };

  handleDeleteNote = index => {
    const { NotesCards } = this.state;
    let id = _.findIndex(NotesCards, { id: index });
    NotesCards.splice(id, 1);
    this.setState({
      NotesCards
    });
  };
  handleExpandClick = (id, event) => {
    const { NotesCards } = this.state;
    for (var i in NotesCards) {
      if (NotesCards[i].note_id === id) {
        NotesCards[i].expanded = !NotesCards[i].expanded;

        break;
      }
    }

    this.setState({
      anchorEl: event.currentTarget,
      NotesCards
    });
  };
  handleNoteColorChange(item, color) {
    const { NotesCards } = this.state;
    for (var i in NotesCards) {
      if (NotesCards[i].note_id === item) {
        NotesCards[i].color = color;
        NotesCards[i].expanded = !NotesCards[i].expanded;

        break;
      }
    }
    this.setState({
      anchorEl: null,
      NotesCards
    });
  }
  render() {
    const { classes, c_style } = this.props;
    const { anchorEl, NotesCards } = this.state;
    const NoteColumn = column => (
      <Grid
        style={{
          padding: "10px",
          height: column.isCompound ? "100%" : "",
          display: "grid"
        }}
        item
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
            title={column.category}
          />
          <CardContent style={{ padding: 2, height: "100%" }}>
            <Droppable droppableId={column.category}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getDroppableStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {_
                    .filter(NotesCards, { category: column.category })
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
                            <Paper
                              className={classes.paper}
                              style={{ backgroundColor: element.color }}
                            >
                              <Input
                                type="text"
                                style={{ overflowY: "hidden" }}
                                disableUnderline={true}
                                fullWidth
                                value={element.headline}
                                placeholder="Note headline"
                                onChange={event =>
                                  this.handleNoteDescriptionChange(
                                    element.note_id,
                                    "headline",
                                    event
                                  )
                                }
                              />
                              <Input
                                value={element.description}
                                fullWidth
                                placeholder="Note Description"
                                multiline
                                margin={10}
                                onChange={event =>
                                  this.handleNoteDescriptionChange(
                                    element.note_id,
                                    "description",
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
                                    this.handleExpandClick(element.note_id, event)
                                  }
                                >
                                  <ColorLensIcon />
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
                                anchorEl={anchorEl}
                                style={{ width: "100%" }}
                                open={element.expanded}
                              >
                                {BeautifulColors.map(e => {
                                  return (
                                    <Button
                                      mini
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
                                    />
                                  );
                                })}
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
      <div>
        <Grid container style={{ backgroundColor:"#4ebdd4", padding:"5px"}}>
          <Grid item xs={12}>

            <FormControl>
              <InputLabel htmlFor="project_name">Project Name</InputLabel>
              <Input
                defaultValue="Test Project"
                id="project_name"
                className={classes.input}
                inputProps={{
                  'aria-label': 'Description',
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>

            <FormControl fullWidth>
              <InputLabel htmlFor="project_name">Project Name</InputLabel>
              <Input
                defaultValue="Project Description"
                id="project_name"
                className={classes.input}
                inputProps={{
                  'aria-label': 'Description',
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Grid container alignItems="stretch">
            {canvas_style["standard_canvas"].map(column => {
              if (!column.isCompound) return NoteColumn(column);
              else
                return (
                  <Grid style={{}} item xs={2} container>
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
      </div>
    );
  }
}

Designer.propTypes = {
  classes: PropTypes.object.isRequired,
  c_style: PropTypes.string.isRequired
};

export default withRouter(compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(Designer));