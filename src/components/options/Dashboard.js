import React, {useState, useEffect} from 'react';
import Common from '../Common';
import {serverUrl} from "../../configs";
import Chart from "react-google-charts";
import request, {checkStatus, parseJSON} from "../../useful/Functions";

const url = `${serverUrl}/gateways`;

function Dashboard() {
    const [gateways, setGateways] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const before = () => {
        if (error) {
            setError(null);
        }
        setLoading(true);
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

    const loadDevices = () => {
        before();

        Promise.all(gateways.map(x => request(`${url}/${x.id}/devices`)))
            .then(response => {
                const dt = [['Gateways', 'Active Devices', "Inactive Devices"]];

                for (let i = 0, l = gateways.length; i < l; i += 1) {
                    const gateway = gateways[i];
                    const active = response[i].filter(f => f.active).length;
                    dt.push([`${gateway.name} (${gateway.serial})`, active, response[i].length - active]);
                }

                setData(dt);
            })
            .catch(e => {
                const x = {
                    name: e.name,
                    message: e.message,
                    tooltip: 'Try reloading Devices data',
                    reloadFunc: loadDevices
                };

                setError(x);
            });
    };

    useEffect(() => {
        if (loading) {
            setLoading(false);
        }
    }, [gateways, error, data]);

    useEffect(() => {
        if (gateways && gateways.length) {
            loadDevices();
        }
    }, [gateways]);

    useEffect(() => {
        load();
    }, []);

    return (<Common title="Dashboard" loading={loading} error={error}>
        {data && data.length ? <Chart
            width={'100%'}
            height={'450px'}
            chartType="Bar"
            loader={<div>Loading data</div>}
            data={data}
            options={{
                chart: {
                    title: 'Gateways and Devices',
                    subtitle: 'Showing all Gateways and their Devices',
                },
            }}
            rootProps={{ 'data-testid': '2' }}
        /> : 'No data found. You must populate the App with Gateways and Devices to display this dashboard.'}
    </Common>);
}

export default Dashboard;
