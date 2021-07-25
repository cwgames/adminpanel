import React, { Component } from 'react';
import Axios from 'axios';
import PlayerListing from './PlayerListing';
import { PlayerManagerConfiguration } from '../constants';

class PlayerManager extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            players : [],
        };
        this.fetchPlayerList = this.fetchPlayerList.bind(this);
        this.handleAdminChange = this.handleAdminChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePremiumChange = this.handlePremiumChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.commitPlayerChanges = this.commitPlayerChanges.bind(this);
    }

    player() {
        var player = {
            key : '',
            name : '',
            email_address : '',
            admin_rights : false,
            premium_expire_date: ''
        }
        return player;
    }

    componentDidMount() {
        this.fetchPlayerList();
    }

    fetchPlayerList() {
        const playerRequest = {
            option : 0
        };
        Axios.post('./access/playeradmin.php',playerRequest).then((response) => {
            var data = response.data;
            var playerList = [];
            Array.prototype.forEach.call(data, element => {
                var player = this.player();
                player.name = element.username;
                player.key = element.username;
                player.email_address = element.email_address;
                player.admin_rights = Boolean(element.admin_rights);
                player.premium_expire_date = element.premium_expire_date;
                playerList.push(player);
            });
            this.setState({players: playerList});
        });
    }
    

    render() {
        return this.state.players.length > 0? 
        (<div>
        <table border='5px'>
        {this.state.players.map((p,index) => (
            <PlayerListing id={index}
                        username={p.name}
                        email_address={p.email_address}
                        premium_expire_date={p.premium_expire_date}
                        admin_rights={p.admin_rights}
                        handleUsernameChange={this.handleUsernameChange}
                        handleEmailChange={this.handleEmailChange}
                        handleAdminChange={this.handleAdminChange}
                        handlePremiumChange={this.handlePremiumChange}
                        commitPlayerChanges={this.commitPlayerChanges}/>
        ))}</table> </div>)  : <p>No players found</p>;
    }

    handleUsernameChange(event,id) {
        
        this.setState(prevState => {
            var tempPlayers = prevState.players;
            tempPlayers[id].name = event.target.value;
            return {players : tempPlayers};
        });
    }

    handleEmailChange(event,id) {
        console.log('id is '+id);
        this.setState(prevState => {
            var tempPlayers = prevState.players;
            console.log(tempPlayers);
            console.log(tempPlayers[id].email_address);
            tempPlayers[id].email_address = event.target.value;
            return {players : tempPlayers};
        });
    }

    handleAdminChange(event,id) {
        this.setState(prevState => {
            var tempPlayers = prevState.players;
            tempPlayers[id].admin_rights = event.target.value;
            return {players : tempPlayers};
        });
    }

    handlePremiumChange(event,id) {
        this.setState(prevState => {
            var tempPlayers = prevState.players;
            tempPlayers[id].premium_expire_date = event.target.value;
            return {players : tempPlayers};
        });
    }

    commitPlayerChanges(id) {
        const data = {
            option : PlayerManagerConfiguration.OPTION_UPDATE,
            key : this.state.players[id].key,
            username : this.state.players[id].name,
            email_address : this.state.players[id].email_address,
            premium_expire_date : this.state.players[id].premium_expire_date,
            admin_rights : this.state.players[id].admin_rights? 1 : 0
        };

        Axios.post('./access/playeradmin.php', data).then((response) => {
            alert(response.data);
        });
    }
}
export default PlayerManager;