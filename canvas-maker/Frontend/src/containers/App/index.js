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
                            <Route exact path="/A/" component={requireNoAuthentication(HomeContainer)} />
                            <Route path="/A/main" component={requireAuthentication(ProtectedView)} />
                            <Route path="/A/login" component={requireNoAuthentication(LoginView)} />
                            <Route path="/A/register" component={requireNoAuthentication(RegisterView)} />
                            <Route path="/A/editaccount" component={requireAuthentication(EditAccountView)} />
                            <Route path="/A/home" component={requireNoAuthentication(HomeContainer)} />
                            <Route path="/A/dashboard" component={requireAuthentication(Dashboard)} />
                            <Route path="/A/designer/:canvas_id" component={requireAuthentication(Designer)} />
                            <Route path="/share/:canvas_id" component={requireNoAuthentication(Designer)} />
                            <Route path="/A/trydesigner" component={requireNoAuthentication(Designer)} />

                            <Route exact path="/B/" component={requireNoAuthentication(HomeContainer)} />
                            <Route path="/B/main" component={requireAuthentication(ProtectedView)} />
                            <Route path="/B/login" component={requireNoAuthentication(LoginView)} />
                            <Route path="/B/register" component={requireNoAuthentication(RegisterView)} />
                            <Route path="/B/editaccount" component={requireAuthentication(EditAccountView)} />
                            <Route path="/B/home" component={requireNoAuthentication(HomeContainer)} />
                            <Route path="/B/dashboard" component={requireAuthentication(Dashboard)} />
                            <Route path="/B/designer/:canvas_id" component={requireAuthentication(Designer)} />
                            <Route path="/B/trydesigner" component={requireNoAuthentication(Designer)} />

                            <Route exact path="/C/" component={requireNoAuthentication(HomeContainer)} />
                            <Route path="/C/main" component={requireAuthentication(ProtectedView)} />
                            <Route path="/C/login" component={requireNoAuthentication(LoginView)} />
                            <Route path="/C/register" component={requireNoAuthentication(RegisterView)} />
                            <Route path="/C/editaccount" component={requireAuthentication(EditAccountView)} />
                            <Route path="/C/home" component={requireNoAuthentication(HomeContainer)} />
                            <Route path="/C/dashboard" component={requireAuthentication(Dashboard)} />
                            <Route path="/C/designer/:canvas_id" component={requireAuthentication(Designer)} />
                            <Route path="/C/trydesigner" component={requireNoAuthentication(Designer)} />

                            <Route exact path="/D/" component={requireNoAuthentication(HomeContainer)} />
                            <Route path="/D/main" component={requireAuthentication(ProtectedView)} />
                            <Route path="/D/login" component={requireNoAuthentication(LoginView)} />
                            <Route path="/D/register" component={requireNoAuthentication(RegisterView)} />
                            <Route path="/D/editaccount" component={requireAuthentication(EditAccountView)} />
                            <Route path="/D/home" component={requireNoAuthentication(HomeContainer)} />
                            <Route path="/D/dashboard" component={requireAuthentication(Dashboard)} />
                            <Route path="/D/designer/:canvas_id" component={requireAuthentication(Designer)} />
                            <Route path="/D/trydesigner" component={requireNoAuthentication(Designer)} />



                            <Route component={(NotFound)} />

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
