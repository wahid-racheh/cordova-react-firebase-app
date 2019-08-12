import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";

import withStyles from "@material-ui/core/styles/withStyles";

import ReactPullToRefreshWrapper from "../../../shared/components/pulltorefresh/ReactPullToRefreshWrapper";
import ContactList from "../components/ContactList";
import { ADD_CONTACT } from "../../../constants";

import { ContactProvider, ContactConsumer } from "../ContactContext";

import Grid from "@material-ui/core/Grid";

import MyButton from "../../../shared/components/MyButton";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import SyncIcon from "@material-ui/icons/Sync";

import { connect } from "react-redux";

import {
  getContacts,
  syncContacts,
  stopSync,
  setAddAction
} from "../../../redux/actions";

const styles = theme => {
  return {
    ...theme,
    pageTitle: {
      textAlign: "center",
      padding: "1rem"
    },
    animateSyncBtn: {
      animation: "loader 0.6s linear",
      animationIterationCount: "infinite"
    },
    btnSync: {
      float: "right"
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
      stopSync,
      getContacts
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
              nativeIds,
              cloudIds,
              selectSyncDevice,
              selectSyncCloud,
              handleSelectDevice,
              handleSelectCloud,
              handleSynchronize
            } = props;

            const btnSyncClassName = isSyncingItems
              ? classes.animateSyncBtn
              : null;
            return (
              <Fragment>
                <ReactPullToRefreshWrapper
                  loading={loading}
                  action={getContacts}
                >
                  {!loading && !allContacts.length ? (
                    <Typography variant="h4" className={classes.pageTitle}>
                      No contact found !
                    </Typography>
                  ) : (
                    <Fragment>
                      {!loading && !!allIds.length && (
                        <Grid container>
                          <Grid item sm={10} xs={10}>
                            <FormGroup>
                              <Grid container>
                                <Grid item sm={4}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={selectSyncCloud}
                                        onChange={handleSelectCloud}
                                        disabled={!cloudIds.length}
                                      />
                                    }
                                    label="Sync Clound"
                                  />
                                </Grid>
                                <Grid item sm={4}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={selectSyncDevice}
                                        onChange={handleSelectDevice}
                                        disabled={!nativeIds.length}
                                      />
                                    }
                                    label="Sync Device"
                                  />
                                </Grid>
                                <Grid item sm={4} />
                              </Grid>
                            </FormGroup>
                          </Grid>
                          <Grid item sm={2} xs={2}>
                            <MyButton
                              tip="Sync"
                              onClick={handleSynchronize}
                              btnClassName={`${btnSyncClassName} ${
                                classes.btnSync
                              }`}
                            >
                              <SyncIcon
                                color={
                                  !isSyncingItems ? "primary" : "secondary"
                                }
                              />
                            </MyButton>
                          </Grid>
                        </Grid>
                      )}
                      <ContactList {...props} />
                    </Fragment>
                  )}
                </ReactPullToRefreshWrapper>
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
