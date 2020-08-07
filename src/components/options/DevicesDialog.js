import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import RefreshIcon from '@material-ui/icons/Refresh';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import {
    formatDate,
    getDateAsString,
    getStringAsDate,
    getUnique,
    retrieveDateAsString,
    validateUidExists
} from "../../useful/Functions";

function DevicesDialog(props) {
    const {device, handleClose, handleAccept, devices} = props;
    const [data, setData] = useState({...device});

    const dataHandler = prop => {
        setData({...data, [prop.name]: prop.value});
    };

    const handleData = prop => event => {
        if (prop !== 'active') {
            let {value} = event.target;
            if (prop === 'datecreated') {
                value = getStringAsDate(value);
            }
            dataHandler({name: prop, value});
        } else {
            dataHandler({name: 'active', value: event.target.checked});
        }
    };

    const accept = () => {
        const obj = {data, creating: !device};
        handleAccept(obj);
    };

    const generateUID = () => {
        const value = getUnique();
        dataHandler({name: 'uid', value});
    };

    let uidError = null;
    if (data.uid) {
        if (isNaN(data.uid)) {
            uidError = 'Not a number, you may press generate button to get a proper one';
        }
        if (validateUidExists(devices, device, +data.uid)) {
            uidError = 'This UID already exists';
        }
    }

    return (
        <Dialog open onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{`${device ? 'Edit' : 'New'} Device`}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    InputLabelProps={{shrink: data.uid}}
                    error={uidError}
                    margin="dense"
                    id="serial"
                    label="UID"
                    type="text"
                    value={data.uid}
                    onChange={handleData('uid')}
                    helperText={uidError}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <Tooltip title={`Generate ${data.uid ? 'another ' : ''}UID`}>
                                <IconButton
                                    onClick={generateUID}
                                    size="small"
                                >
                                    <RefreshIcon fontSize="small"/>
                                </IconButton>
                            </Tooltip>
                        )
                    }}
                />
                <TextField
                    margin="dense"
                    id="vendor"
                    label="Vendor"
                    type="text"
                    value={data.vendor}
                    onChange={handleData('vendor')}
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    id="date"
                    margin="dense"
                    label="Date created"
                    type="date"
                    onChange={handleData('datecreated')}
                    defaultValue={data && data.datecreated && formatDate(typeof data.datecreated === 'string' ? new Date(data.datecreated) : data.datecreated)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                    variant="outlined"
                />
                <FormControlLabel
                    control={<Switch checked={data.active} onChange={handleData('active')} name="checkedActive"/>}
                    label="Active"
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

DevicesDialog.defaultProps = {
    device: null,
    devices: []
};

DevicesDialog.propTypes = {
    devices: PropTypes.array,
    device: PropTypes.object,
    handleClose: PropTypes.func.isRequired,
    handleAccept: PropTypes.func.isRequired
};

export default DevicesDialog;
