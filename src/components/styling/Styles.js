import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        width: '100%'
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4)
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column'
    },
    handPointer: {
        cursor: 'pointer'
    },
    margin: {
        marginRight: '5px'
    }
}));
