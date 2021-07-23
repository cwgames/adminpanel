import React, { Component } from 'react';
import LoginForm from './components/LoginForm';
import NewsEditor from './components/NewsEditor';
import PlayerManager from './components/PlayerManager';

class AdminPanel extends Component {

    state = {
        isLoggedIn : false,
        username : '',
        selection : 0
    };

    componentDidMount()
    {
        this.openNewsEditor = this.openNewsEditor.bind(this);
        this.openPlayerManagement = this.openPlayerManagement(this);
    }

    handleLogin = userName => {
        this.setState({username: userName, isLoggedIn : true});
    }

    getUsername() {
        var username = this.state.username;
        return username.charAt(0).toUpperCase()+username.slice(1);
    }

    render() {
        return (<div className={this.state.isLoggedIn? 'center' : 'left'}>
                <img src="./images/logo.png" alt="Logo"/>
                {this.state.isLoggedIn?  this.renderPanel() : <LoginForm onLogin={this.handleLogin}/> }
                </div>);
    }

    renderPanel() {
        return (<div>
                <table cellSpacing="30%">
                    <tbody>
                        <tr> 
                            <td></td>
                            <td></td>
                            <td><h1>Admin Panel</h1></td>
                            <td></td>
                            <td></td>
                            <td><p>Welcome back, {this.getUsername()}</p></td>
                        </tr> 
                    </tbody>
                </table>
                <table cellPadding="5%">
                    <tbody>
                        <tr>
                            <td><img src="./images/editnews.png" alt="news editor" 
                            onClick={this.openNewsEditor}/></td>
                            <td><img src="./images/players.png" alt="player editor" 
                            onClick={this.openPlayerManagement}/></td>
                        </tr>
                    </tbody>
                </table>
                {this.renderPanelSelection()}
                </div>);
    }

    openNewsEditor() {
        this.setState({selection : 1});
    }

    openPlayerManagement() {
        this.setState({selection : 2});
    }
    
    renderPanelSelection() {
        const selections = {
            none: 0,
            newsEditor : 1,
            playerManager : 2
        };

        switch(this.state.selection) {
            case selections.newsEditor:
                return <NewsEditor/>;
            case selections.playerManager:
                return <PlayerManager/>;
            default:
                return null;
        }
    }
}

export default AdminPanel;