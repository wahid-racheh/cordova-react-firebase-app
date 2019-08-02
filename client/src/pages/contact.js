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
import { getContacts } from "../redux/actions/contact.actions";

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
      data: { contacts: contactList, loading }
    } = this.props;
    return (
      <ContactProvider contacts={contactList} enableSelection={true}>
        <ContactConsumer>
          {props => {
            const { contacts, selectAll, handleSelectAll } = props;
            return (
              <Fragment>
                {!loading && !contacts.length ? (
                  <Typography variant="h4" className={classes.pageTitle}>
                    No contact found !
                  </Typography>
                ) : (
                  <Fragment>
                    {!loading && (
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
                        <MyButton tip="Sync">
                          <SyncIcon color="primary" />
                        </MyButton>
                      </div>
                    )}
                    <ContactList {...props} />;
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
  getContacts: PropTypes.func.isRequired
};

const enhance = compose(
  connect(
    state => ({ data: state.contact }),
    { setAddAction, getContacts }
  ),
  withStyles(styles)
);

export default enhance(Contact);
