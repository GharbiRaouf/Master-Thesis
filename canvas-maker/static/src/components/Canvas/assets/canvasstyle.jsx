export const CanvasModelStyles = theme => ({
  card: {
    minWidth: "18%",
    backgroundColor: "#e2e2e2",
    margin: 0,
    padding: 0
  },
  fab: {
    // position: 'absolute',
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
    zIndex:1000
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