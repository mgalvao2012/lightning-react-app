import React from 'react';

import * as ContactService from './services/ContactService';

import {HomeHeader} from './components/PageHeader';

import ContactList from './ContactList';
import NewContactWindow from './NewContactWindow';

export default React.createClass({

    getInitialState() {
        return {contacts: []};
    },

    componentDidMount() {
        ContactService.findAll().then(contacts => this.setState({contacts}));
    },

    sortHandler(sortOrder) {
        ContactService.findAll(sortOrder).then(contacts => {
            this.setState({sortOrder, contacts})
        });
    },

    newHandler() {
        this.setState({addingContact: true});
    },

    deleteHandler(data) {
        ContactService.deleteItem(data.contact_id).then(() => {
            ContactService.findAll(this.state.sort).then(contacts => this.setState({contacts}));
        });
    },

    editHandler(data) {
        window.location.hash = "#contact/" + data.contact_id + "/edit";
    },

    saveHandler(Contact) {
        ContactService.createItem(Contact).then(() => {
            ContactService.findAll().then(contacts => this.setState({addingContact: false, contacts}));
        });
    },

    cancelHandler() {
        this.setState({addingContact: false});
    },

    render() {
        return (
            <div>
                <HomeHeader type="contacts"
                            title="My Contacts"
                            actions={[{value:"new", label:"New Contact"}]}
                            itemCount={this.state.contacts.length}
                            viewOptions={[{value:"table", label:"Table", icon:"table"},{value:"tiles", label:"Tiles", icon:"location"}]}
                            sortOptions={[{value:"first_name", label:"First Name"},{value:"last_name", label:"Last Name"}]}
                            onNew={this.newHandler}
                            onSort={this.sortHandler}
                            onViewChange={this.viewChangeHandler}/>
                <ContactList contacts={this.state.contacts} onSort={this.sortHandler} onDelete={this.deleteHandler} onEdit={this.editHandler}/>
                {this.state.addingContact ?  <NewContactWindow onSave={this.saveHandler} onCancel={this.cancelHandler}/> : ""}
            </div>
        );
    }
});