import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import RouterIcon from '@material-ui/icons/Router';
import DeviceUnknownIcon from '@material-ui/icons/DeviceUnknown';
import InfoIcon from '@material-ui/icons/Info';

import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import {About, Dashboard, Devices, Gateways, NotFound} from './components/asyncPages';

const useStyles = makeStyles((theme) => ({
    drawerPapper: {
        width: 'inherit'
    },
    links: {
        textDecoration: 'none',
        color: theme.palette.text.primary
    }
}));

function App() {
    const classes = useStyles();
    return (
        <Router>
            <div style={{display: 'flex'}}>
                <Drawer
                    style={{width: '200px'}}
                    variant="persistent"
                    anchor="left"
                    open
                    classes={{paper: classes.drawerPapper}}>
                    <List>
                        <Link to="/" className={classes.links}>
                            <ListItem button>
                                <ListItemIcon>
                                    <DashboardIcon/>
                                </ListItemIcon>
                                <ListItemText primary={'Dashboard'} />
                            </ListItem>
                        </Link>
                        <Link to="/gateways" className={classes.links}>
                            <ListItem button>
                                <ListItemIcon>
                                    <RouterIcon/>
                                </ListItemIcon>
                                <ListItemText primary={'Gateways'} />
                            </ListItem>
                        </Link>
                        <Link to="/devices" className={classes.links}>
                            <ListItem button>
                                <ListItemIcon>
                                    <DeviceUnknownIcon/>
                                </ListItemIcon>
                                <ListItemText primary={'Devices'} />
                            </ListItem>
                        </Link>
                        <Link to="/about" className={classes.links}>
                            <ListItem button>
                                <ListItemIcon>
                                    <InfoIcon/>
                                </ListItemIcon>
                                <ListItemText primary={'About'} />
                            </ListItem>
                        </Link>
                    </List>
                </Drawer>
                <Switch>
                    <Route exact path="/" component={Dashboard} />
                    <Route path="/gateways" component={Gateways} />
                    <Route path="/devices" component={Devices} />
                    <Route path="/about" component={About} />
                    <Route component={NotFound} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
