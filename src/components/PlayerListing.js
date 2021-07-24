import React, { Component } from 'react';

class PlayerListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editable : false
        }
    }
    
    componentDidMount() {
        this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    }

    handleCheckBoxChange() {
        this.setState(prevState => {
            return {editable : !prevState.editable};
        });
    }

    render() {
        return (<tr>
            <td>
                <p>Edit user?</p>
                <input type='checkbox' value={this.state.editable} 
                    onChange={this.handleCheckBoxChange}/>
            </td>
            <td>
                <p>Username:</p>
                <input value={this.props.username}
                    onChange={(event) => this.props.handleUsernameChange(event,this.props.id)}/>
            </td>
            <td>
                <p>Email address:</p>
                <input value={this.props.email_address}
                    onChange={(event) => this.props.handleEmailChange(event,this.props.id)}/>
            </td>
            <td>
                <p>Premium expire date:</p>
                <input value={this.props.premium_expire_date}
                    onChange={(event) => this.props.handlePremiumChange(event,this.props.id)}/>
            </td>
            <td>
                <p>Admin?</p>
                <input type='checkbox' value={this.props.admin_rights}
                    onChange={(event) => this.props.handleAdminChange(event,this.props.id)}/>
            </td>
            <td>
                <button>Delete</button>
                <button>Change password</button>
            </td>
            <td>
                <button>Confirm changes</button>
            </td>
        </tr>)
    }
}

export default PlayerListing;