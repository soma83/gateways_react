import React from 'react';
import Common from '../Common';
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

function About() {
    return (<Common title="About Gateways">
        <div style={{textAlign: 'left'}}>
            <Typography variant="h5" color="textSecondary" align="center" style={{textAlign: 'left'}}>
                {'About Gateways'}
            </Typography>

            <p><strong>This is just a Practical Excercise to solve the following:</strong></p>
            <p>This sample project is managing gateways - master devices that control multiple peripheral devices.
                Your task is to create a REST service (JSON/HTTP) for storing information about these gateways and their
                associated devices. This information must be stored in the database.
                When storing a gateway, any field marked as “to be validated” must be validated and an error returned if
                it is invalid. Also, no more that 10 peripheral devices are allowed for a gateway.
                The service must also offer an operation for displaying information about all stored gateways (and their
                devices) and an operation for displaying details for a single gateway.
                Finally, it must be possible to add and remove a device from a gateway.</p>

            Each gateway has:
            <ul>
                <li>a unique serial number (string),</li>
                <li>human-readable name (string),</li>
                <li>IPv4 address (to be validated),</li>
                <li>multiple associated peripheral devices.</li>
            </ul>
            Each peripheral device has:
            <ul>
                <li>a UID (number),</li>
                <li>vendor (string),</li>
                <li>date created,</li>
                <li>status - online/offline.</li>
            </ul>

            <p><strong>It was build using:</strong></p>
            <ul>
                <li>Javascript 6,</li>
                <li>NodeJS 12.15.0,</li>
                <li>React JS 16.13.1,</li>
                <li>Material UI 4.11.0,</li>
                <li>Loopback 4 for the Rest API,</li>
                <li>MongoDB 3.6.8.</li>
            </ul>
            <p><strong>Designed and programmed by:</strong></p>
            <p>soma83<br/>
                Have a nice day!
            </p>
        </div>
    </Common>);
}

export default About;
