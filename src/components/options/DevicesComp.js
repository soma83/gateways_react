import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import Select from "@material-ui/core/Select";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import {useStyles} from "../styling/Styles";
import DevicesDialog from "./DevicesDialog";
import {checkStatus, getDateAsString, parseJSON, validateUidExists} from "../../useful/Functions";
import {serverUrl} from "../../configs";
import BackProcess from "../utils/BackProcess/BackProcess";
import ShowError from "../utils/ShowError/ShowError";
import Notification from "../utils/Notification/Notification";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

const urlGateway = `${serverUrl}/gateways`;
const urlDevices = `${serverUrl}/devices`;

function DevicesComp(props) {
    const {gateway} = props;

    const [devices, setDevices] = useState(null);
    const [gateways, setGateways] = useState(null);
    const [selGateway, setSelGateway] = useState(gateway);
    const [openDelete, setOpenDelete] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [localNotification, setLocalNotification] = useState(null);
    const [openDialog, setOpenDialog] = useState({open: false, edit: null});

    const classes = useStyles();

    const addDevice = (creating = false) => {
        if (selGateway.id === '000') {
            setLocalNotification({type: 'error', msg: 'Select a Gateway to create a new Device'});
        } else if (creating && devices.length === 10) {
            setLocalNotification({type: 'error', msg: 'The selected Gateway already has 10 Devices'});
        } else {
            setOpenDialog({open: true, edit: null});
        }
    };

    const editDevice = device => {
        setOpenDialog({open: true, edit: {...device}});
    };

    const handleClose = () => {
        if (openDelete) {
            setOpenDelete(false);
        }
        if (openDialog.open) {
            setOpenDialog({open: false, edit: null});
        }
    };
    
    const handleDelete = () => {
        before();
        const {id} = openDelete;

        fetch(`${urlDevices}/${id}`, {method: 'DELETE'})
            .then(checkStatus)
            .then(parseJSON)
            .then(() => {
                setDevices(devices.filter(x => x.id !== id));
                setLocalNotification({type: 'success', msg: 'Device deleted'});
            })
            .catch(() => {
                setLocalNotification({type: 'error', msg: 'Device was not deleted'});
                setLoading(false);
            });

        handleClose();
    };

    const deleteDevice = id => {
        setOpenDelete({id});
    };

    const acceptEditCreate = x => {
        const dev = {...x.data};

        const isNew = x.creating;

        if (!dev || !dev.uid || !dev.vendor || !dev.datecreated) {
            setLocalNotification({
                type: 'error',
                msg: `All those fields are required in order to ${isNew ? 'create' : 'update'} the Device`
            });
        } else if (isNaN(dev.uid)) {
            setLocalNotification({type: 'error', msg: 'That UID is not a number'});
        } else if (validateUidExists(devices, x.data, +x.data.uid)) {
            setLocalNotification({type: 'error', msg: 'That UID already exists'});
        } else {
            dev.gatewayId = selGateway.id;
            dev.uid = +dev.uid;

            if (!isNew) {
                delete dev.id;
            }

            before();

            fetch(isNew ? urlDevices : urlDevices + '/' + x.data.id, Object.assign({}, {
                method: isNew ? 'POST' : 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dev)
            }))
                .then(checkStatus)
                .then(parseJSON)
                .then((response) => {
                    const dvs = [...devices];

                    if (isNew) {
                        dev.id = response.id;
                        dvs.push(dev);
                    } else {
                        const index = dvs.findIndex(xx => xx.id === x.data.id);
                        dvs[index] = dev;
                    }

                    setDevices(dvs);

                    setLocalNotification({type: 'success', msg: `Device ${isNew ? 'created' : 'updated'}`});

                    handleClose();
                })
                .catch(e => {
                    setLocalNotification({type: 'error', msg: `Unable to ${isNew ? 'create' : 'update'} the Device`});
                });
        }
    };

    const before = () => {
        if (error) {
            setError(null);
        }
        setLoading(true);
    };

    const loadOnly = () => {
        before();

        fetch(selGateway.id === '000' ? urlDevices : `${urlGateway}/${selGateway.id}/devices`)
            .then(checkStatus)
            .then(parseJSON)
            .then(response => {
                setDevices(response);
            })
            .catch(e => {
                const x = {
                    name: e.name,
                    message: e.message,
                    tooltip: 'Try reloading Devices for the selected Gateway',
                    reloadFunc: loadOnly
                };

                setError(x);
            });
    };

    const load = () => {
        before();
        fetch(urlGateway)
            .then(checkStatus)
            .then(parseJSON)
            .then(response => {
                const array = response;
                if (array.length) {
                    array.unshift({id: '000', name: 'All of them'});
                }
                setGateways(array);
            })
            .catch(e => {
                const x = {
                    name: e.name,
                    message: e.message,
                    tooltip: 'Try reloading Gateways',
                    reloadFunc: load
                };

                setError(x);
            })
    };

    const handleSel = event => {
        setSelGateway(gateways.find(x => x.id === event.target.value));
    };

    const getGatewayData = id => {
        const gtway = gateways.find(x => x.id === id);
        return !gtway ? 'No data' : `${gtway.name} (${gtway.serial})`;
    };

    useEffect(() => {
        if (loading) {
            setLoading(false);
        }
    }, [error, localNotification, gateways, devices, loading]);

    useEffect(() => {
        if (!gateway && gateways && gateways.length) {
            setSelGateway(gateways[0]);
        }
    }, [gateway, gateways]);

    useEffect(() => {
        if (selGateway) {
            loadOnly();
        }
    }, [selGateway]);

    useEffect(() => {
        load();
    }, []);

    return (
        <>
            <BackProcess open={loading}/>
            <Grid container spacing={3}>
                {error && <Grid item xs={12}>
                    <ShowError error={error}/>
                </Grid>}

                <Grid item xs={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleOutlineIcon/>}
                        onClick={() => addDevice(true)}
                    >
                        {'Add device'}
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Select
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        style={{top: '2px', height: '38px'}}
                        value={selGateway && selGateway.id}
                        onChange={handleSel}
                        startAdornment={(
                            <InputAdornment position="start">
                                {'Gateway'}
                            </InputAdornment>
                        )}
                    >
                        {gateways && gateways.map(x => <MenuItem
                            value={x.id}>{x.id === '000' ? x.name : `${x.name} (${x.serial})`}</MenuItem>)}
                    </Select>
                </Grid>
                <Grid item xs={3} style={{textAlign: 'right'}}>
                    {`${devices && devices.length ? (devices.length + ' device' + (devices.length === 1 ? '' : 's')) : 'No devices found'}`}
                </Grid>
            </Grid>
            <Paper className={classes.paper} elevation={1} style={{marginTop: '10px'}}>
                <TableContainer component={Paper}>
                    <Table stickyHeader aria-label="devices-table">
                        <TableHead>
                            <TableRow>
                                {selGateway && selGateway.id === '000' && <TableCell align="left">Gateway</TableCell>}
                                <TableCell align="left">UID</TableCell>
                                <TableCell align="left">Vendor</TableCell>
                                <TableCell align="left">Date created</TableCell>
                                <TableCell align="left">Active</TableCell>
                                <TableCell align="left">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {devices && devices.map(x => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={x.id}>
                                    {(!selGateway || selGateway.id === '000') &&
                                    <TableCell component="th" scope="row" align="left">
                                        {getGatewayData(x.gatewayId)}
                                    </TableCell>
                                    }
                                    <TableCell component="th" scope="row" align="left">
                                        {x.uid}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="left">
                                        {x.vendor}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="left">
                                        {getDateAsString(new Date(x.datecreated))}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="left">
                                        {x.active ? 'Active' : 'Inactive'}
                                    </TableCell>
                                    <TableCell align="right" style={{width: '100px'}}>
                                        <Tooltip title="Edit">
                                            <IconButton aria-label="edit" className={classes.margin} size="small"
                                                        onClick={() => editDevice(x)}>
                                                <EditIcon fontSize="small"/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                aria-label="delete"
                                                className={classes.margin}
                                                size="small"
                                                onClick={() => deleteDevice(x.id)}>
                                                <DeleteOutlineIcon fontSize="small"/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {localNotification && <Notification
                type={localNotification.type}
                handleClose={() => {
                    setLocalNotification(null);
                }}
                msg={localNotification.msg}
            />}

            {openDialog.open && <DevicesDialog
                handleClose={handleClose}
                handleAccept={acceptEditCreate}
                device={openDialog.edit}
                devices={devices}
            />}
            {openDelete && <Dialog
                open={openDelete}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Delete confirm"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {'You are about to delete the current Device. Sure?'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {'No'}
                    </Button>
                    <Button onClick={handleDelete} color="primary" autoFocus>
                        {'Yes'}
                    </Button>
                </DialogActions>
            </Dialog>}
        </>
    )
}

DevicesComp.defaultProps = {
    gateway: null
};

DevicesComp.propTypes = {
    gateway: PropTypes.object
};

export default DevicesComp;
