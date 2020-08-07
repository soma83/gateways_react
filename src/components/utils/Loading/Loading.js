import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    circularProgress: {
        position: 'fixed',
        top: 'calc(50% - 45px)',
        left: 'calc(50% - 45px)',
    }
}));

function Loading() {
    const classes = useStyles();
    return (<CircularProgress className={classes.circularProgress} size={90} thickness={1} color="secondary" />);
}

export default Loading;
