import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Route, Switch } from 'react-router-dom';
/* application components */
import Header from '../../components/Header';
import { Footer } from '../../components/Footer';
import Grid from "@material-ui/core/Grid";

import { HomeContainer } from '../../containers/HomeContainer';
import LoginView from '../../components/LoginView';
import RegisterView from '../../components/RegisterView';
import EditAccountView from '../../components/EditAccountView';
import ProtectedView from '../../components/ProtectedView';
import Dashboard from '../../components/Dashboard';
import Designer from '../../components/Canvas/CanvasDesigner';
import NotFound from '../../components/NotFound';

import { DetermineAuth } from '../../components/DetermineAuth';
import { requireAuthentication } from '../../components/AuthenticatedComponent';
import { requireNoAuthentication } from '../../components/notAuthenticatedComponent';


const theme = createMuiTheme();
class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
    static propTypes = {
        children: PropTypes.node,
    };

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <section>
                    <Header />
                    {/* <div
                        className="container"
                        style={{ marginLeft:0, marginTop: 10, marginBottom: 250, minWidth: 500,width:"100%",minHeight :100 }}
                    > */}
                    <Grid container justify="space-around" style={{minWidth:500}}>

                        <Switch>
                            <Route exact path="/" component={requireNoAuthentication(HomeContainer)} />
                            <Route path="/main" component={requireAuthentication(ProtectedView)} />
                            <Route path="/login" component={requireNoAuthentication(LoginView)} />
                            <Route path="/register" component={requireNoAuthentication(RegisterView)} />
                            <Route path="/editaccount" component={requireAuthentication(EditAccountView)} />
                            <Route path="/home" component={requireNoAuthentication(HomeContainer)} />
                            <Route path="/dashboard" component={requireAuthentication(Dashboard)} />
                            <Route path="/designer/:canvas_id" component={requireAuthentication(Designer)} />
                            <Route path="/share/:canvas_id" component={requireAuthentication(Designer)} />
                            <Route path="/trydesigner" component={requireNoAuthentication(Designer)} />
                            <Route component={DetermineAuth(NotFound)} />
                        </Switch>

                    {/* </div> */}
                    </Grid>
                    <div>
                        <Footer />
                    </div>
                </section>
            </MuiThemeProvider>
        );
    }
}

export { App };
