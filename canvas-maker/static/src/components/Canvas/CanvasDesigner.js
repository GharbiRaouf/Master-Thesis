import React from "react";
import { withStyles } from "@material-ui/core/styles";
import _ from "lodash";
import CanvasModel from "./CanvasModel"
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { compose } from 'redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/canvas';
import axios from "axios";

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


class Designer extends React.Component {
  constructor(props) {
    super(props)
    const canvas_id = props.match.params.canvas_id
    if (canvas_id) props.setCanvasToEdit(canvas_id, props.token)
  }

  render() {
    const { isFetching, loaded } = this.props
    return (
      <div>
        {(loaded && !isFetching) ? <CanvasModel /> : "standard_canvas"}
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Designer));