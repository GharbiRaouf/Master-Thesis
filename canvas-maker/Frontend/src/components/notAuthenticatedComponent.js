import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux';
// import { push } from 'react-router-redux';
import * as actionCreators from '../actions/auth';
import { validate_token } from "../utils/http_functions"

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        userEmail: state.auth.userEmail,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}


export function requireNoAuthentication(Component) {

    class notAuthenticatedComponent extends React.Component {

        state = {
            loaded: false
        }

        // constructor(props) {
        //     super(props);
        // }

        componentWillMount() {
            this.checkAuth();
        }

        componentWillReceiveProps(nextProps) {
            this.checkAuth(nextProps);
        }

        checkAuth(props = this.props) {
            if (props.isAuthenticated) {
                return props.redirectToRoute("/"+this.props.location.pathname[1]+'/main');

            } else {
                const token = localStorage.getItem('token');
                if (token) {
                    validate_token(token)
                        .then(res => {
                            if (res.status === 200) {
                                this.props.loginUserSuccess(token);
                                return props.redirectToRoute("/"+this.props.location.pathname[1]+'/main');

                            } else {
                                this.setState({
                                    loaded: true,
                                });
                            }
                        }).catch(error => {
                            this.setState({
                                loaded: false,
                            });
                        });
                } else {
                    this.setState({
                        loaded: true,
                    });
                }
            }
        }

        render() {
            return (
                <div>
                    {!this.props.isAuthenticated || this.state.loaded
                        ? <Component {...this.props} />
                        : <h3>
                            You are at the wrong Position
                        </h3>
                    }
                </div>
            );

        }
    }

    notAuthenticatedComponent.propTypes = {
        loginUserSuccess: PropTypes.func,
        isAuthenticated: PropTypes.bool,
    };

    return withRouter(connect(mapStateToProps, mapDispatchToProps)(notAuthenticatedComponent));

}
