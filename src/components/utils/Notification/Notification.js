import React from 'react';
import PropTypes from 'prop-types';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

export function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Notification(props) {
    const {
        handleClose, msg, type, autoHide
    } = props;
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
            transitionDuration={{enter: 250, exit: 0}}
            open={msg}
            autoHideDuration={autoHide !== -1 ? autoHide : null}
            onClose={handleClose}
        >
            <Alert onClose={handleClose} severity={type}>{msg}</Alert>
        </Snackbar>
    );
}

Notification.defaultProps = {
    autoHide: 5000
};

Notification.propTypes = {
    handleClose: PropTypes.func.isRequired,
    msg: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    autoHide: PropTypes.number
};

export default Notification;
