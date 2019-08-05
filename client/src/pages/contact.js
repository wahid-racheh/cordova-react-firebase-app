import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";
import withStyles from "@material-ui/core/styles/withStyles";

import ContactList from "../components/contact/ContactList";
import { ADD_CONTACT } from "../utils/constants";

import {
  ContactProvider,
  ContactConsumer
} from "../components/contact/ContactContext";

import MyButton from "../utils/MyButton";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import SyncIcon from "@material-ui/icons/Sync";

import { connect } from "react-redux";
import { setAddAction } from "../redux/actions/ui.actions";
import {
  getContacts,
  syncContacts,
  stopSync
} from "../redux/actions/contact.actions";

const styles = theme => {
  return {
    ...theme,
    sync: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "1rem"
    },
    pageTitle: {
      textAlign: "center",
      padding: "1rem"
    },
    animateSyncBtn: {
      animation: "loader 0.6s linear",
      animationIterationCount: "infinite"
    }
  };
};

class Contact extends Component {
  componentDidMount() {
    this.props.setAddAction(ADD_CONTACT);
    this.props.getContacts();
  }

  render() {
    const {
      classes,
      data: { contacts, loading, isSyncingItems },
      syncContacts,
      stopSync
    } = this.props;
    return (
      <ContactProvider
        {...{
          contacts,
          enableSelection: true,
          syncContacts,
          stopSync,
          isSyncingItems
        }}
      >
        <ContactConsumer>
          {props => {
            const {
              allContacts,
              allIds,
              selectAll,
              handleSelectAll,
              handleSynchronize
            } = props;

            const btnSyncClassName = isSyncingItems
              ? classes.animateSyncBtn
              : null;
            return (
              <Fragment>
                {!loading && !allContacts.length ? (
                  <Typography variant="h4" className={classes.pageTitle}>
                    No contact found !
                  </Typography>
                ) : (
                  <Fragment>
                    {!loading && !!allIds.length && (
                      <div className={classes.sync}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectAll}
                                onChange={handleSelectAll}
                                value="selected"
                              />
                            }
                            label="Select All"
                          />
                        </FormGroup>
                        <MyButton
                          tip="Sync"
                          onClick={handleSynchronize}
                          btnClassName={btnSyncClassName}
                        >
                          <SyncIcon
                            color={!isSyncingItems ? "primary" : "secondary"}
                          />
                        </MyButton>
                      </div>
                    )}
                    <ContactList {...props} />
                  </Fragment>
                )}
              </Fragment>
            );
          }}
        </ContactConsumer>
      </ContactProvider>
    );
  }
}

Contact.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  setAddAction: PropTypes.func.isRequired,
  getContacts: PropTypes.func.isRequired,
  syncContacts: PropTypes.func.isRequired,
  stopSync: PropTypes.func.isRequired
};

const enhance = compose(
  connect(
    state => ({ data: state.contact }),
    { setAddAction, getContacts, syncContacts, stopSync }
  ),
  withStyles(styles)
);

export default enhance(Contact);
