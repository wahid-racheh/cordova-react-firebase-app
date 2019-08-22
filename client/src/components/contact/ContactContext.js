import React, { Component } from "react";
import { mergeUniqueItems, isEmpty } from "../../utils/utility";

const ContactContext = React.createContext();

class ContactProvider extends Component {
  subscription;
  state = {
    allContacts: [],
    selectSyncDevice: false,
    selectSyncCloud: false,
    checkedItems: [],
    allIds: [],
    nativeIds: [],
    cloudIds: [],
    enableSelection: false,
    isSyncingItems: false
  };

  componentDidMount() {
    this.setInternalState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setInternalState(nextProps);
  }

  initIds = (allIds, key) => {
    return allIds.reduce((acc, e) => {
      return e[key] ? [...acc, e.nativeId] : [...acc];
    }, []);
  };

  setInternalState = ({ contacts, enableSelection, isSyncingItems }) => {
    let allIds = [];
    contacts.forEach(c => {
      if (!c.isDuplicated && (c.shouldBeSynced || c.shouldBeAddedToDevice)) {
        allIds.push({
          nativeId: c.nativeId,
          isNative: !c.shouldBeSynced,
          isCloud: !c.shouldBeAddedToDevice
        });
      }
    });
    const nativeIds = this.initIds(allIds, "isNative");
    const cloudIds = this.initIds(allIds, "isCloud");
    this.setState(() => {
      return {
        enableSelection,
        allContacts: contacts,
        allIds,
        nativeIds,
        cloudIds,
        isSyncingItems
      };
    });
  };

  updateSelectedList = newState => {
    const { isSyncingItems, enableSelection } = this.state;
    if (!isSyncingItems && enableSelection) {
      this.setState({
        ...newState
      });
    }
  };

  onSelectItem = item => () => {
    const {
      nativeId,
      isDuplicated,
      isSyncing,
      shouldBeSynced,
      shouldBeAddedToDevice
    } = item;
    if (
      !isDuplicated &&
      !isSyncing &&
      (shouldBeSynced || shouldBeAddedToDevice)
    ) {
      const { checkedItems, nativeIds, cloudIds } = this.state;
      const currentIndex = checkedItems.indexOf(nativeId);
      const array = [...checkedItems];
      if (currentIndex === -1) {
        array.push(nativeId);
      } else {
        array.splice(currentIndex, 1);
      }
      const checkedNativeItems = array.reduce((acc, id) => {
        return nativeIds.indexOf(id) > -1 ? [...acc, id] : [...acc];
      }, []);
      const checkedCloudItems = array.reduce((acc, id) => {
        return cloudIds.indexOf(id) > -1 ? [...acc, id] : [...acc];
      }, []);
      this.updateSelectedList({
        checkedItems: [...array],
        selectSyncCloud: checkedCloudItems.length === cloudIds.length,
        selectSyncDevice: checkedNativeItems.length === nativeIds.length
      });
    }
  };

  getCheckedList = (checked, array, key) => {
    const { checkedItems, allIds } = this.state;
    return checked
      ? mergeUniqueItems(checkedItems, array)
      : checkedItems.reduce((acc, id) => {
          const item = allIds.find(e => e.nativeId === id);
          return !isEmpty(item) && !item[key] ? [...acc, id] : [...acc];
        }, []);
  };

  onSelectDevice = event => {
    const {
      target: { checked }
    } = event;
    const ids = this.getCheckedList(checked, this.state.nativeIds, "isNative");
    this.updateSelectedList({
      checkedItems: ids,
      selectSyncDevice: checked
    });
  };

  onSelectCloud = event => {
    const {
      target: { checked }
    } = event;
    const ids = this.getCheckedList(checked, this.state.cloudIds, "isCloud");
    this.updateSelectedList({
      checkedItems: ids,
      selectSyncCloud: checked
    });
  };

  setChecked = id => {
    return this.state.checkedItems.indexOf(id) > -1;
  };

  unsubscribe = () => {
    this.props.stopSync();
    this.subscription && this.subscription.unsubscribe();
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  onSynchronize = () => {
    const { checkedItems, allContacts, isSyncingItems } = this.state;
    const array = checkedItems.reduce((acc, id) => {
      const item = allContacts.find(
        c => c.nativeId === id && (c.shouldBeSynced || c.shouldBeAddedToDevice)
      );
      return !isEmpty(item) ? [...acc, item] : [...acc];
    }, []);
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
          setChecked: this.setChecked,
          handleSelectDevice: this.onSelectDevice,
          handleSelectCloud: this.onSelectCloud,
          handleSelectItem: this.onSelectItem,
          handleSynchronize: this.onSynchronize
        }}
      >
        {this.props.children}
      </ContactContext.Provider>
    );
  }
}

const ContactConsumer = ContactContext.Consumer;

export { ContactProvider, ContactConsumer };
