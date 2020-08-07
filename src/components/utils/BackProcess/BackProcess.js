import React from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    circularProgress: {
        position: 'fixed',
        top: 'calc(50% - 45px)',
        left: 'calc(50% - 45px)'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff'
    }
}));

function BackProcess(props) {
    const classes = useStyles();
    const {open} = props;

    return (
        <Backdrop className={classes.backdrop} open={open} timeout={0} transitionDuration={50}>
            <CircularProgress className={classes.circularProgress} size={90} thickness={1} color="secondary" />
        </Backdrop>
    );
}

BackProcess.defaultProps = {
    open: false
};

BackProcess.propTypes = {
  open: PropTypes.bool
};

export default BackProcess;
