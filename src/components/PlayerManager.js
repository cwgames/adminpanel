import React, { Component } from 'react';
import Axios from 'axios';

class PlayerManager extends Component {

    constructor(props)
    {
        super(props)
        this.state = {
            playerList : [],
        };
        this.fetchPlayerList();
    }

    player()
    {
        var player = {
            name : '',
            email_address : '',
            admin_rights : '',
            premium_expire_date: ''
        }
        return player;
    }

    componentDidMount()
    {
        this.fetchPlayerList = this.fetchPlayerList.bind(this);
    }

    fetchPlayerList()
    {
        const playerRequest = {
            option : 0
        }
        Axios.post('./access/playeradmin.php',playerRequest).then((response) => {
            var data = response.data;
            alert('Received');
            console.log(data);
            //this.setState({playerList: list});
        });
    }
    

    render()
    {
        return this.state.playerList.length > 0? 
        <div>
        <table>
        {this.state.playerList.map((p) => (
            <tr border='5px'>
                <td>

                </td>
            </tr>
        ))}</table> </div>  : <p>Not available</p>;
    }
}
export default PlayerManager;