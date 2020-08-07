import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {ipvalidator, validateSerialExists} from "../../useful/Functions";

function GatewayDialog(props) {
    const {gateway, handleAccept, handleClose, gateways} = props;
    const [data, setData] = useState({...gateway});

    const handleData = prop => event => {
        const x = {...data};
        x[prop] = event.target.value;
        setData(x);
    };

    const accept = () => {
        const obj = {data, creating: !gateway};
        handleAccept(obj);
    };

    let errorSerial = false;
    let errorIp = false;

    if (data && data.serial && data.serial.length && validateSerialExists(gateways, gateway, data.serial)) {
        errorSerial = true;
    }

    if (data && data.ipaddress && data.ipaddress.length && !ipvalidator(data.ipaddress)) {
        errorIp = true;
    }

    return (
        <Dialog open onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{`${gateway ? 'Edit' : 'New'} Gateway`}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    error={errorSerial}
                    margin="dense"
                    id="name"
                    label="Serial"
                    type="text"
                    value={data.serial}
                    onChange={handleData('serial')}
                    helperText={errorSerial ? 'This serial already exists' : null}
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    margin="dense"
                    id="name"
                    label="Name"
                    type="text"
                    value={data.name}
                    onChange={handleData('name')}
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    error={errorIp}
                    margin="dense"
                    id="name"
                    label="IP4 Address"
                    type="text"
                    value={data.ipaddress}
                    onChange={handleData('ipaddress')}
                    fullWidth
                    helperText={errorIp ? 'This IP address is not a valid IP4 address' : null}
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    {'Cancel'}
                </Button>
                <Button onClick={accept} color="primary">
                    {'Ok'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

GatewayDialog.defaultProps = {
    gateway: null,
    gateways: []
};

GatewayDialog.propTypes = {
    gateway: PropTypes.object,
    handleAccept: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    gateways: PropTypes.array
};

export default GatewayDialog;
