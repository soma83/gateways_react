import React from 'react';
import PropTypes from 'prop-types';
import MuiAlert from '@material-ui/lab/Alert';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ShowError(props) {
    const {error} = props;

    return (
        <Alert
            severity="error"
            action={error.reloadFunc && (
                <Tooltip title={error.tooltip || 'Reload'}>
                    <Button color="inherit" onClick={error.reloadFunc}>
                        {'RETRY'}
                    </Button>
                </Tooltip>
            )}
        >
            {`${error.name ? error.name + ': ' : ''}${error.message}`}
        </Alert>
    );
}

ShowError.propTypes = {
    error: PropTypes.object.isRequired
};

export default ShowError;
