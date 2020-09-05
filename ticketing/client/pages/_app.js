import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div className = "container">
            <Header currentUser = {currentUser}/>
            <Component currentUser = {currentUser} {...pageProps}/>
        </div>
    );
};

AppComponent.getInitialProps = async (appContext) => {
    // WHEN HARD REFRESH, TYPE URL -> SERVER EXECUTED
    // WHEN NAVIGATE WITH ROUTER -> CLIENT EXECUTED
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');

    // pass client built to child component
    const pageProps = (await appContext.Component.getInitialProps?.(appContext.ctx, client, data.currentUser)) || {};

    return {
        pageProps,
        ...data,
    };
};

export default AppComponent;