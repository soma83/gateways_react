import Loadable from 'react-loadable';
import Loading from './utils/Loading/Loading';

export const NotFound = Loadable({
    loader: () => import('./notFound/NotFound'),
    loading: Loading
});

export const Dashboard = Loadable({
    loader: () => import('./options/Dashboard'),
    loading: Loading
});

export const Gateways = Loadable({
    loader: () => import('./options/Gateways'),
    loading: Loading
});

export const Devices = Loadable({
    loader: () => import('./options/Devices'),
    loading: Loading
});

export const About = Loadable({
    loader: () => import('./options/About'),
    loading: Loading
});
