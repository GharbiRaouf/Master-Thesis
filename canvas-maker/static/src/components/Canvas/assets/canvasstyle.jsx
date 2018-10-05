import red from "@material-ui/core/colors/red";

export const CanvasPreviewStyle = theme => ({
    card: {
        maxWidth: 400,
        height: "100%",
        backgroundColor: "rgb(25, 30, 35)"
    },
    media: {
        height: "100%",
        width: "100%",
        // paddingTop: "50%" // 16:9
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
export const CanvasModelStyles = theme => ({
    card: {
        minWidth: "18%",
        backgroundColor: "#e2e2e2",
        margin: 0,
        padding: 0
    },
    fab_btn: {
        position: 'fixed',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
        zIndex: 1000,       
        margin: 0,
        top: 'auto',
        left: 'auto',
        
    },
    fab: {
        // position: 'absolute',
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed',
        zIndex: 1000
        // bottom: theme.spacing.unit * 2,
        // right: theme.spacing.unit * 2,
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
        backgroundColor: "red"
    },
    resize: {
        fontSize: 10
    }
});
export const canvasTeamStyles = theme => ({
    card: {
        maxWidth: "300px",
        padding: "10px"
    },
    media: {
        height: 0,
        paddingTop: "56.25%" // 16:9
    },
    actions: {
        display: "flex"
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
    }
});


export const canvasDetailsStyles = theme => ({
    card: {
        maxWidth: "300px",
        padding: "10px"
    },
    media: {
        height: 0,
        paddingTop: "56.25%" // 16:9
    },
    actions: {
        display: "flex"
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
    }
});


export const canvasShareStyles = theme => ({
    card: {
        maxWidth: "300px",
        padding: "10px"
    },
    media: {
        height: 0,
        paddingTop: "56.25%" // 16:9
    },
    actions: {
        display: "flex"
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
    }
});

export const menuStyles = theme => ({
    root: {
        position: "relative",
        display: "flex",
        width: "100%"
    },
    fab_btn: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
    flex_display: {
        position: "relative",
        display: "flex",
    },
    appBar: {
        zIndex: theme.zIndex.drawer - 1
    },
    drawerPaper: {
        position: "relative"
    },
    subDrawerPaper: {
        position: "relative",
        zIndex: theme.zIndex.drawer + 1
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit,
        minWidth: 0 // So the Typography noWrap works
    },
    toolbar: theme.mixins.toolbar
});

export const BeautifulColors = [
    "#f44336",
    "#9c27b0",
    "#3f51b5",
    "#2196f3",
    "#00bcd4",
    "#009688",
    "#ffeb3b",
    "#ff9800"
];