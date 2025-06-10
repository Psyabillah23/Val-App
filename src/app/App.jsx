import React from 'react';
import { Router } from './Router';
import { AppProviders } from './AppProviders';
import '../assets/styles/index.css';


const App = () => {
    return (
        <AppProviders>
            <Router />
        </AppProviders>
    );
};

export default App;