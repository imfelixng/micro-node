import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div className = "container">
            <Header currentUser = {currentUser}/>
            <Component {...pageProps}/>
        </div>
    );
};

AppComponent.getInitialProps = async (appContext) => {
    // WHEN HARD REFRESH, TYPE URL -> SERVER EXECUTED
    // WHEN NAVIGATE WITH ROUTER -> CLIENT EXECUTED
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');
    
    const pageProps = (await appContext.Component?.getInitialProps?.(appContext.ctx)) || {};

    return {
        pageProps,
        ...data,
    };
};

export default AppComponent;