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

// import { DetermineAuth } from '../../components/DetermineAuth';
import { requireAuthentication } from '../../components/AuthenticatedComponent';
// import { }from '../../components/notAuthenticatedComponent';


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
                    <Grid container justify="space-around" style={{ minWidth: 500 }}>

                        <Switch>
                            {/* <Route exact path="/A/" component={HomeContainer} />
                            <Route path="/A/main" component={ProtectedView} />
                            <Route path="/A/login" component={LoginView} />
                            <Route path="/A/register" component={RegisterView} />
                            <Route path="/A/editaccount" component={EditAccountView} />
                            <Route path="/A/home" component={HomeContainer} />
                            <Route path="/A/dashboard" component={Dashboard} />
                            <Route path="/A/designer/:canvas_id" component={Designer} />
                            <Route path="/share/:canvas_id" component={Designer} />
                            <Route path="/A/trydesigner" component={Designer} />

                            <Route exact path="/B/" component={HomeContainer} />
                            <Route path="/B/main" component={ProtectedView} />
                            <Route path="/B/login" component={LoginView} />
                            <Route path="/B/register" component={RegisterView} />
                            <Route path="/B/editaccount" component={EditAccountView} />
                            <Route path="/B/home" component={HomeContainer} />
                            <Route path="/B/dashboard" component={Dashboard} />
                            <Route path="/B/designer/:canvas_id" component={Designer} />
                            <Route path="/B/trydesigner" component={Designer} />

                            <Route exact path="/C/" component={HomeContainer} />
                            <Route path="/C/main" component={ProtectedView} />
                            <Route path="/C/login" component={LoginView} />
                            <Route path="/C/register" component={RegisterView} />
                            <Route path="/C/editaccount" component={EditAccountView} />
                            <Route path="/C/home" component={HomeContainer} />
                            <Route path="/C/dashboard" component={Dashboard} />
                            <Route path="/C/designer/:canvas_id" component={Designer} />
                            <Route path="/C/trydesigner" component={Designer} />

                            <Route exact path="/D/" component={HomeContainer} />
                            <Route path="/D/main" component={ProtectedView} />
                            <Route path="/D/login" component={LoginView} />
                            <Route path="/D/register" component={RegisterView} />
                            <Route path="/D/editaccount" component={EditAccountView} />
                            <Route path="/D/home" component={HomeContainer} />
                            <Route path="/D/dashboard" component={Dashboard} />
                            <Route path="/D/designer/:canvas_id" component={Designer} />
                            <Route path="/D/trydesigner" component={Designer} /> */}

                            <Route exact path="/A/" component={HomeContainer} />
                            <Route path="/A/main" component={requireAuthentication(ProtectedView)} />
                            <Route path="/A/login" component={LoginView} />
                            <Route path="/A/register" component={RegisterView} />
                            <Route path="/A/editaccount" component={requireAuthentication(EditAccountView)} />
                            <Route path="/A/home" component={HomeContainer} />
                            <Route path="/A/dashboard" component={requireAuthentication(Dashboard)} />
                            <Route path="/A/designer/:canvas_id" component={requireAuthentication(Designer)} />
                            <Route path="/A/share/:canvas_id" component={Designer} />
                            <Route path="/A/trydesigner" component={Designer} />

                            <Route exact path="/B/" component={HomeContainer} />
                            <Route path="/B/main" component={requireAuthentication(ProtectedView)} />
                            <Route path="/B/login" component={LoginView} />
                            <Route path="/B/register" component={RegisterView} />
                            <Route path="/B/editaccount" component={requireAuthentication(EditAccountView)} />
                            <Route path="/B/home" component={HomeContainer} />
                            <Route path="/B/dashboard" component={requireAuthentication(Dashboard)} />
                            <Route path="/B/designer/:canvas_id" component={requireAuthentication(Designer)} />
                            <Route path="/B/share/:canvas_id" component={Designer} />
                            <Route path="/B/trydesigner" component={Designer} />

                            <Route exact path="/C/" component={HomeContainer} />
                            <Route path="/C/main" component={requireAuthentication(ProtectedView)} />
                            <Route path="/C/login" component={LoginView} />
                            <Route path="/C/register" component={RegisterView} />
                            <Route path="/C/editaccount" component={requireAuthentication(EditAccountView)} />
                            <Route path="/C/home" component={HomeContainer} />
                            <Route path="/C/dashboard" component={requireAuthentication(Dashboard)} />
                            <Route path="/C/designer/:canvas_id" component={requireAuthentication(Designer)} />
                            <Route path="/C/share/:canvas_id" component={Designer} />
                            <Route path="/C/trydesigner" component={Designer} />

                            <Route exact path="/D/" component={HomeContainer} />
                            <Route path="/D/main" component={requireAuthentication(ProtectedView)} />
                            <Route path="/D/login" component={LoginView} />
                            <Route path="/D/register" component={RegisterView} />
                            <Route path="/D/editaccount" component={requireAuthentication(EditAccountView)} />
                            <Route path="/D/home" component={HomeContainer} />
                            <Route path="/D/dashboard" component={requireAuthentication(Dashboard)} />
                            <Route path="/D/designer/:canvas_id" component={requireAuthentication(Designer)} />
                            <Route path="/D/share/:canvas_id" component={Designer} />
                            <Route path="/D/trydesigner" component={Designer} />

                            {/* <Route exact path="/" component={HomeContainer} />
                            <Route path="/main" component={requireAuthentication(ProtectedView)} />
                            <Route path="/login" component={LoginView} />
                            <Route path="/register" component={RegisterView} />
                            <Route path="/editaccount" component={requireAuthentication(EditAccountView)} />
                            <Route path="/home" component={HomeContainer} />
                            <Route path="/dashboard" component={requireAuthentication(Dashboard)} />
                            <Route path="/designer/:canvas_id" component={requireAuthentication(Designer)} />
                        <Route path="/trydesigner" component={Designer} /> */}
                            <Route path="/share/:canvas_id" component={Designer} />



                            <Route component={(NotFound)} />
                            {/* <Route component={DetermineAuth(NotFound)} /> */}

                        </Switch>
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
