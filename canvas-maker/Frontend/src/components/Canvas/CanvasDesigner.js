import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Settings from "@material-ui/icons/Settings";
import GroupIcon from "@material-ui/icons/Group";
import ShareIcon from "@material-ui/icons/Share";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Slide from '@material-ui/core/Slide';

import CanvasModel from "./CanvasModel"

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/canvas';

import CanvasShare from "./menu/canvas_share";
import CanvasDetails from "./menu/canvas_details";
import CanvasTeam from "./menu/canvas_team";

import { menuStyles } from "./assets/canvasstyle";

function mapStateToProps(state) {
  return {
    canvas: state.canvas.canvas,
    token: state.auth.token,
    isFetching: state.canvas.isFetching,
    loaded: state.canvas.loaded,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

const MENU = {
  CanvasDetails: { menu: "CanvasDetails", component: <CanvasDetails /> },
  CanvasTeam: { menu: "CanvasTeam", component: <CanvasTeam /> },
  CanvasShare: { menu: "CanvasShare", component: <CanvasShare /> }
};

class Designer extends React.Component {
  constructor(props) {
    super(props)
    const canvas_id = props.match.params.canvas_id
    if (canvas_id) props.setCanvasToEdit(canvas_id, props.token)
  }
  state = {
    item_to_display: null
  };
  handleOpenDrawer = x => {

    if ((x === false) || (x === this.state.item_to_display)) {
      this.setState({
        item_to_display: false
      });
      return;
    }
    this.setState({
      item_to_display: x
    });
  };

  render() {
    const { isFetching, loaded, classes } = this.props
    const { item_to_display } = this.state;
    const isShare=(this.props.match.path).toLowerCase().indexOf("share")>0
    return (
      <div style={{ width: "100%" }}>


        <div className={classes.root}>

        {!isShare&&
          <ClickAwayListener onClickAway={() => this.handleOpenDrawer(item_to_display)}>
            <div className={classes.flex_display}>
              <Drawer
                variant="permanent"
                classes={{
                  paper: classes.drawerPaper
                }}
              >
                <List>
                  <ListItem
                    button
                    onClick={() => this.handleOpenDrawer("CanvasDetails")}
                  >
                    <ListItemIcon>
                      <Settings />
                    </ListItemIcon>
                  </ListItem>
                  <ListItem
                    button
                    onClick={() => this.handleOpenDrawer("CanvasTeam")}
                  >
                    <ListItemIcon>
                      <GroupIcon />
                    </ListItemIcon>
                  </ListItem>
                  <ListItem
                    button
                    onClick={() => this.handleOpenDrawer("CanvasShare")}
                  >
                    <ListItemIcon>
                      <ShareIcon />
                    </ListItemIcon>
                  </ListItem>
                </List>
              </Drawer>

              <Slide direction="right" in={Boolean(item_to_display)} >

                <Drawer
                  variant="permanent"
                  style={{ minWidth:Boolean(item_to_display)?300:0}}
                  classes={{
                    paper: classes.subDrawerPaper
                  }}
                >

                  {Boolean(item_to_display) && MENU[item_to_display].component}
                </Drawer>
              </Slide>
            </div>
          </ClickAwayListener>}

          <main className={classes.content}>
            {(loaded && !isFetching) ? <CanvasModel isShare={isShare} /> : "Working on Canvas Design"}

          </main>
        </div>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(menuStyles)(Designer)));