const LandingPage = ({ currentUser }) => {
    if (currentUser) {
        return <h1>You are signed in</h1>
    }
    return (
        <h1>You are NOT sign in</h1>
    )
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
    return {};
};

export default LandingPage;