switch(window.location.pathname) {
    case '/login':
        return <Login />;
    case '/register':
        return <Register />;
        default:
            return <Home />;
}