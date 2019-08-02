import React, { Component } from "react";

const ContactContext = React.createContext();

class ContactProvider extends Component {
  state = {
    contacts: [],
    selectAll: true,
    checkedItems: [],
    allIds: [],
    enableSelection: false
  };

  componentDidMount() {
    this.setInternalState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setInternalState(nextProps);
  }

  setInternalState = ({ contacts, enableSelection }) => {
    if (contacts) {
      let contactList = [];
      contacts.forEach(item => {
        const c = { ...item };
        contactList = [...contactList, c];
      });

      const allIds = contactList.map(contact => contact.id);
      this.setState(() => {
        return {
          enableSelection,
          contacts: contactList,
          selectAll: enableSelection,
          allIds,
          checkedItems: enableSelection ? allIds : []
        };
      });
    }
  };

  handleSelectItem = value => () => {
    if (this.state.enableSelection) {
      const { checkedItems, contacts } = this.state;
      const currentIndex = checkedItems.indexOf(value);
      const array = [...checkedItems];
      if (currentIndex === -1) {
        array.push(value);
      } else {
        array.splice(currentIndex, 1);
      }
      this.setSelectAll(array.length === contacts.length);
      this.updateCheckedList(array);
    }
  };

  handleSelectAll = event => {
    if (this.state.enableSelection) {
      const {
        target: { checked }
      } = event;
      if (checked) {
        this.updateCheckedList([...this.state.allIds]);
      } else {
        this.updateCheckedList([]);
      }
      this.setSelectAll(checked);
    }
  };

  setChecked = id => {
    return this.state.checkedItems.indexOf(id) > -1;
  };

  setSelectAll = checked => {
    this.setState({ selectAll: checked });
  };

  updateCheckedList = array => {
    this.setState({ checkedItems: [...array] });
    console.log("list : ", array);
  };

  render() {
    return (
      <ContactContext.Provider
        value={{
          ...this.state,
          setSelectAll: this.setSelectAll,
          setChecked: this.setChecked,
          handleSelectAll: this.handleSelectAll,
          handleSelectItem: this.handleSelectItem
        }}
      >
        {this.props.children}
      </ContactContext.Provider>
    );
  }
}

const ContactConsumer = ContactContext.Consumer;
export { ContactProvider, ContactConsumer };
