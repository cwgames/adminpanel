import React, { Component } from 'react';
import Axios from 'axios';
import {Redirect} from 'react-router-dom';

class LoginForm extends Component {
    state = {
        invalidLogin : false,
        numberOfLogins : 0,
        username : "",
        password : ""
    };
    

    updateName = event => {
        this.setState({username: event.target.value});
    }

    updatePass = event => {
        this.setState({password: event.target.value});
    }

    handleSubmit = event => {
        event.preventDefault();

        const loginInfo = {
            username: this.state.username,
            password: this.state.password
        }
        Axios.post('./access/adminlogin.php',loginInfo)
        .then((response) => {
            if (response.data === 'success') {
                this.props.onLogin(this.state.username);
            } else  {
                this.setState({invalidLogin: true});
                this.setState(prevState => {
                    return {numberOfLogins: prevState.numberOfLogins + 1}
                });
                if (this.state.numberOfLogins > 3)
                {
                    return <Redirect to='http://duckduckgo.com'/>;
                }
            }
        });
    }

    displayError() {
        return this.state.invalidLogin? <p>Invalid login, try again.</p> : null;
    }

    render() {
        return (
        <div>
            <h2>Admin login</h2>
            {this.displayError()}
            <form onSubmit={this.handleSubmit}>
            <table>
                <tr>
                    <p>Username:</p>
                    <input type="text" name="user" onChange={this.updateName}/>
                </tr>
                <tr>
                    <p>Password:</p>
                    <input type="password" name="pass" onChange={this.updatePass}/>
                </tr>
                <tr>
                    <button type="submit">Login</button>
                </tr>
            </table>
            </form>
        </div>
        );
    }


}

export default LoginForm;