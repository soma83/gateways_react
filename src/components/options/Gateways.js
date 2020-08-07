import React, {useState, useEffect} from 'react';
import Common from '../Common';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from "@material-ui/core/Grid";
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import EditIcon from "@material-ui/icons/Edit";
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import IconButton from '@material-ui/core/IconButton';
import {serverUrl} from "../../configs";
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import {checkStatus, ipvalidator, parseJSON, validateSerialExists} from "../../useful/Functions";
import {useStyles} from "../styling/Styles";
import Paper from "@material-ui/core/Paper";
import Notification from "../utils/Notification/Notification";
import GatewayDialog from "./GatewayDialog";
import DevicesComp from "./DevicesComp";

const url = `${serverUrl}/gateways`;

function Gateways() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [gateways, setGateways] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [localNotification, setLocalNotification] = useState(null);
    const [openDialog, setOpenDialog] = useState({open: false, edit: null});
    const [openDevices, setOpenDevices] = useState(null);

    const classes = useStyles();

    const addGateway = () => {
        setOpenDialog({open: true, edit: null});
    };

    const editGateway = gateway => {
        setOpenDialog({open: true, edit: {...gateway}});
    };

    const before = () => {
        if (error) {
            setError(null);
        }
        setLoading(true);
    };

    const deleteGateway = id => {
        setOpenDelete({id});
    };

    const handleDelete = () => {
        const {id} = openDelete;

        before();

        fetch(url + '/' + id, {method: 'DELETE'})
            .then(checkStatus)
            .then(parseJSON)
            .then(() => {
                setGateways(gateways.filter(x => x.id !== id));
                setLocalNotification({type: 'success', msg: 'Gateway deleted'});
            })
            .catch(() => {
                setLocalNotification({type: 'error', msg: 'Gateway was not deleted'});
                setLoading(false);
            });

        handleClose();
    };

    const validate = ipaddress => {
        if (ipvalidator(ipaddress)) {
            setLocalNotification({type: 'success', msg: `IP ${ipaddress} is valid IP4 address`});
        } else {
            setLocalNotification({type: 'error', msg: `IP ${ipaddress} is not valid IP4 address`});
        }
    };

    const load = () => {
        before();

        fetch(url)
            .then(checkStatus)
            .then(parseJSON)
            .then(response => {
                setGateways(response);
            })
            .catch(e => {
                const x = {
                    name: e.name,
                    message: e.message,
                    tooltip: 'Try reloading Gateways',
                    reloadFunc: load
                };

                setError(x);
            });
    };

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        if (gateways || error || localNotification) {
            setLoading(false);
        }
    }, [gateways, error, localNotification]);

    const viewDevices = x => {
        setOpenDevices(x);
    };

    const handleClose = () => {
        if (openDelete) {
            setOpenDelete(false);
        }
        if (openEdit) {
            setOpenEdit(false);
        }
        if (openDialog.open) {
            setOpenDialog({open: false, edit: null});
        }
        if (openDevices) {
            setOpenDevices(null);
        }
    };

    const acceptEditCreate = x => {
        const gate = x.data;

        const isNew = x.creating;

        if (!gate || !gate.name || !gate.name.length || !gate.serial || !gate.serial.length || !gate.ipaddress || !gate.ipaddress.length) {
            setLocalNotification({
                type: 'error',
                msg: `All those fields are required in order to ${isNew ? 'create' : 'update'} the Gateway`
            });
        } else if (validateSerialExists(gateways, x.data, x.data.serial)) {
            setLocalNotification({type: 'error', msg: 'That serial already exists'});
        } else if (!ipvalidator(gate.ipaddress)) {
            setLocalNotification({type: 'error', msg: 'That IP address is not a valid IP4 address'});
        } else {
            before();

            const id = !isNew ? gate.id : null;

            if (!isNew) {
                delete gate.id;
            }

            fetch(`${url}${isNew ? '' : '/' + id}`, Object.assign({}, {
                method: isNew ? 'POST' : 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(gate)
            }))
                .then(checkStatus)
                .then(parseJSON)
                .then((response) => {
                    const gtwys = [...gateways];

                    const object = {
                        serial: gate.serial,
                        name: gate.name,
                        ipaddress: gate.ipaddress
                    };

                    if (isNew) {
                        object.id = response.id;
                        gtwys.push(object);
                    } else {
                        const index = gtwys.findIndex(xx => xx.id === id);
                        gtwys[index] = object;
                    }

                    setGateways(gtwys);
                    handleClose();
                    setLocalNotification({type: 'success', msg: `Gateway ${isNew ? 'created' : 'updated'}`});
                })
                .catch(() => {
                    setLocalNotification({type: 'error', msg: `Unable to ${isNew ? 'create' : 'update'} the Gateway`});
                });
        }
    };

    return (<>
        <Common title="Gateways" error={error} loading={loading} reload={load}>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleOutlineIcon/>}
                        onClick={addGateway}
                    >
                        {'Add gateway'}
                    </Button>
                </Grid>
                <Grid item xs={6} style={{textAlign: 'right'}}>
                    {`${gateways && gateways.length ? (gateways.length + ' gateway' + (gateways.length === 1 ? '' : 's')) : 'No gateways found'}`}
                </Grid>
            </Grid>
            <Paper className={classes.paper} elevation={1} style={{marginTop: '10px'}}>
                <TableContainer component={Paper}>
                    <Table stickyHeader aria-label="gateways-table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Serial</TableCell>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">IP4 Address</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {gateways && gateways.map(x => (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={x.id}
                                >
                                    <TableCell component="th" scope="row" align="left">
                                        {x.serial}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="left">
                                        {x.name}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="left">
                                        {x.ipaddress}
                                    </TableCell>
                                    <TableCell align="right" style={{width: '180px'}}>
                                        <Tooltip title="View devices">
                                            <IconButton aria-label="validate" className={classes.margin} size="small"
                                                        onClick={() => viewDevices(x)}>
                                                <FormatListNumberedIcon fontSize="small"/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Validate IP Address">
                                            <IconButton aria-label="validate" className={classes.margin} size="small"
                                                        onClick={() => validate(x.ipaddress)}>
                                                <CheckCircleOutlineIcon fontSize="small"/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit">
                                            <IconButton aria-label="edit" className={classes.margin} size="small"
                                                        onClick={() => editGateway(x)}>
                                                <EditIcon fontSize="small"/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                aria-label="delete"
                                                className={classes.margin}
                                                size="small"
                                                onClick={() => deleteGateway(x.id)}>
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
        </Common>
        {openDialog.open && <GatewayDialog
            handleClose={handleClose}
            handleAccept={acceptEditCreate}
            gateway={openDialog.edit}
            gateways={gateways}
        />}
        {localNotification && <Notification
            type={localNotification.type}
            handleClose={() => {
                setLocalNotification(null);
            }}
            msg={localNotification.msg}
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
                    {'You are about to delete the current Gateway and all its related Devices, if it has any. Sure?'}
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

        {openDevices && <Dialog
            open={openDevices}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Devices"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <DevicesComp gateway={openDevices}/>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    {'Close'}
                </Button>
            </DialogActions>
        </Dialog>}
    </>);
}

export default Gateways;
