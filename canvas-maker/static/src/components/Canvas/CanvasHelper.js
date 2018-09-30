import React from 'react'
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/canvas';
import { withStyles } from '@material-ui/core';

import Modal from '@material-ui/core/Modal';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
// import * as tuto_img from './assets/tutorial/.';
const images = require.context('./assets/tutorial', true)
const imagePath = (name) => images(name, true)



const tutorialSteps = [
    {
        label: 'Welcome to Canvas Maker Tutorial',
        imgPath: imagePath("./canvas_preview.png"),
    },
    {
        label: 'This is your Working space, feel free to edit your Canvas...',
        imgPath: imagePath("./step_1.png"),
    },
    {
        label: 'Add,Edit and Manage your canvas Notes, You will note some Helping indicators ...',
        imgPath: imagePath("./step_2.png"),
    },
    {
        label: 'Drag and Drop Notes between columns, and Change their Colors...',
        imgPath: imagePath("./step_3.png"),
    },
    {
        label: 'In the Toolbar, you can change your Canvas Settings, manage your team, and Sharet it!',
        imgPath: imagePath("./step_4.png"),
    },
];

function mapStateToProps(state) {
    return {
        canvas_helper: state.canvas.canvas_helper,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}


const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 120,
        height: theme.spacing.unit * 80,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        height: 50,
        paddingLeft: theme.spacing.unit * 4,
        marginBottom: 20,
        backgroundColor: theme.palette.background.default,
    },
    img: {
        height: "80%",
        overflow: 'hidden',
        width: '100%',
        padding: theme.spacing.unit * 4,
        backgroundColor:"grey"
        
    },
});

class CanvasHelper extends React.Component {
    /*
    your meths
    
    */
    state = {
        activeStep: 0,
    };

    handleNext = () => {
        this.setState(prevState => ({
            activeStep: prevState.activeStep + 1,
        }));
    };

    handleBack = () => {
        this.setState(prevState => ({
            activeStep: prevState.activeStep - 1,
        }));
    };
    handleCloseCanvasHelper = () => {
        this.props.ShowCanvasHelper()
        this.setState({
            activeStep: 0
        })
    }

    render() {
        const { classes, theme } = this.props;
        const { activeStep } = this.state;
        const maxSteps = tutorialSteps.length;
        // console.log(tuto_img);

        return (
            <div>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.props.canvas_helper}
                    onClose={this.handleCloseCanvasHelper}
                >
                    <div className={classes.paper}>
                        <Paper square elevation={0} className={classes.header}>
                            <Typography>{tutorialSteps[activeStep].label}</Typography>
                        </Paper>
                        <img
                            className={classes.img}
                            src={tutorialSteps[activeStep].imgPath}
                            alt={tutorialSteps[activeStep].label}
                        />
                        <MobileStepper
                            steps={maxSteps}
                            position="static"
                            activeStep={activeStep}
                            className={classes.mobileStepper}
                            nextButton={
                                activeStep === maxSteps - 1?
                                <Button color="primary" variant="raised" size="small" onClick={this.handleCloseCanvasHelper} >
                                    Finish
                                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                                </Button>
                                :
                                <Button size="small" onClick={this.handleNext} >
                                    Next
                                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                                </Button>
                            }
                            backButton={
                                <Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
                                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                                    Back
                            </Button>
                            }
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}

CanvasHelper.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(CanvasHelper)));
