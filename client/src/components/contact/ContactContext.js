import React, { Component } from "react";

const ContactContext = React.createContext();

class ContactProvider extends Component {
  subscription;
  state = {
    allContacts: [],
    selectAll: false,
    checkedItems: [],
    allIds: [],
    enableSelection: false,
    isSyncingItems: false
  };

  componentDidMount() {
    this.setInternalState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setInternalState(nextProps);
  }

  setInternalState = ({ contacts, enableSelection, isSyncingItems }) => {
    let allIds = [];
    contacts.forEach(c => {
      if (!c.isDuplicated) allIds.push(c.phoneNumberId);
    });
    this.setState(() => {
      return {
        enableSelection,
        allContacts: contacts,
        allIds,
        isSyncingItems
      };
    });
  };

  handleSelectItem = ({ phoneNumberId, isDuplicated, isSyncing }) => () => {
    const { isSyncingItems, enableSelection } = this.state;

    if (!isSyncingItems && enableSelection && !isDuplicated && !isSyncing) {
      const { checkedItems, allIds } = this.state;
      const currentIndex = checkedItems.indexOf(phoneNumberId);
      const array = [...checkedItems];
      if (currentIndex === -1) {
        array.push(phoneNumberId);
      } else {
        array.splice(currentIndex, 1);
      }
      this.setSelectAll(array.length === allIds.length);
      this.updateCheckedList(array);
    }
  };

  handleSelectAll = event => {
    const { isSyncingItems, enableSelection } = this.state;
    if (!isSyncingItems && enableSelection) {
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
  };

  unsubscribe = () => {
    this.props.stopSync();
    this.subscription && this.subscription.unsubscribe();
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleSynchronize = () => {
    const { checkedItems, allContacts, isSyncingItems } = this.state;
    let array = [];
    checkedItems.forEach(phoneNumberId => {
      const item = allContacts.find(
        c => c.phoneNumberId === phoneNumberId && c.shouldBeSynced
      );
      if (item) {
        array.push({ ...item });
      }
    });
    if (isSyncingItems) {
      this.unsubscribe();
    } else if (!!array.length) {
      this.subscription = this.props.syncContacts(array);
    }
  };

  render() {
    return (
      <ContactContext.Provider
        value={{
          ...this.state,
          setSelectAll: this.setSelectAll,
          setChecked: this.setChecked,
          handleSelectAll: this.handleSelectAll,
          handleSelectItem: this.handleSelectItem,
          handleSynchronize: this.handleSynchronize
        }}
      >
        {this.props.children}
      </ContactContext.Provider>
    );
  }
}

const ContactConsumer = ContactContext.Consumer;

export { ContactProvider, ContactConsumer };
