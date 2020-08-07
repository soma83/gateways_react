import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import BackProcess from "./utils/BackProcess/BackProcess";
import ShowError from "./utils/ShowError/ShowError";
import {useStyles} from "./styling/Styles";

function Common(props) {
    const classes = useStyles();
    const {children, title, loading, error} = props;

    return (<div className={classes.root}>
        <CssBaseline/>
        <BackProcess open={loading}/>
        <Container maxWidth="false" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper} elevation={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6" style={{paddingBottom: '10px'}}>{title}</Typography>
                                <Divider/>
                            </Grid>
                            {error && <Grid item xs={12}>
                                <ShowError error={error}/>
                            </Grid>}
                            <Grid item xs={12}>
                                {children}
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <>
                        <Typography variant="body1" color="textSecondary" align="center">
                            {'GATEWAYS: Practical Excercise - July 2020'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" align="center">
                            {'By: soma83'}
                        </Typography>
                    </>
                </Grid>
            </Grid>
        </Container>
    </div>);
}

Common.defaultProps = {
    loading: false,
    error: null
};

Common.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.object
};

export default Common;
