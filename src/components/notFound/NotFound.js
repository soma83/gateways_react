import React from 'react';
import Common from '../Common';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

function NotFound() {
    const top = {marginTop: '45px'};

    return (<Common title="Not found">
        <div style={{height: '300px', textAlign: 'center'}}>
            <SentimentVeryDissatisfiedIcon fontSize="large" style={top} />
            <Typography style={top}>{'Sorry, the requested URL was not found.'}</Typography>
            <Button variant="contained" color="primary" component={Link} to="/" style={top}>
                {'Go back to Dashboard'}
            </Button>
        </div>
    </Common>);
}

export default NotFound;
