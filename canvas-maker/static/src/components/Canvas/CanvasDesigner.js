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
  initiateCanvas() {
    const canvas_type = "standard_canvas"
    this.props.createNewCanvas(canvas_type, this.props.token)
  }

  render() {
    const canvas_id = this.props.match.params.canvas_id
    const { isFetching, canvas, loaded } = this.props
    return (
      <div>
        {(loaded && !isFetching) ? <CanvasModel key={canvas.canvas_id} /> : "standard_canvas"}
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Designer));