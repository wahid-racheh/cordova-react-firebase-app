import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";

import { compose } from "recompose";
import LoaderHOC from "../common/loader/LoaderHOC";

import Initials from "../common/Initials";

import { isSmart, isEmpty } from "../../utils/utility";

import { ContactConsumer } from "./ContactContext";

const styles = theme => {
  return {
    ...theme,
    contacts: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
      padding: 0
    },
    fab: {
      position: "absolute",
      bottom: 2,
      right: 2
    },
    syncContact: {
      background: "#f0f8ff"
    },
    saveContact: {
      background: "#faebd7"
    },
    devider: {
      margin: 0
    },
    progress: {
      top: "0.2rem",
      right: "1rem",
      position: "relative"
    }
  };
};

class ContactList extends Component {
  render() {
    const { classes } = this.props;

    const avatarWrapper = (nativeId, displayName, photos) => {
      return isSmart() && !isEmpty(photos) ? (
        <ListItemAvatar>
          <Avatar alt={`Avatar n°${nativeId + 1}`} src={photos[0].value} />
        </ListItemAvatar>
      ) : (
        <Initials text={`${displayName}`} />
      );
    };

    return (
      <ContactConsumer>
        {({ allContacts, enableSelection, handleSelectItem, setChecked }) => {
          return (
            <List className={classes.contacts}>
              {allContacts.map(contact => {
                const {
                  nativeId,
                  displayName,
                  phoneNumbers,
                  photos,
                  emails,
                  shouldBeSynced,
                  shouldBeAddedToDevice,
                  isDuplicated,
                  isSyncing
                } = contact;
                const labelId = `checkbox-list-secondary-label-${nativeId}`;
                const firstPhoneNumber =
                  !isEmpty(phoneNumbers) &&
                  !isEmpty(phoneNumbers[0]) &&
                  phoneNumbers[0].value;
                const firstEmail =
                  !isEmpty(emails) && !isEmpty(emails[0]) && emails[0].value;

                const cssClass =
                  (!isDuplicated &&
                    ((shouldBeSynced && classes.syncContact) ||
                      (shouldBeAddedToDevice && classes.saveContact))) ||
                  null;

                return (
                  <Fragment key={nativeId}>
                    <ListItem
                      key={nativeId}
                      role={undefined}
                      dense
                      button
                      disableRipple={isDuplicated}
                      onClick={handleSelectItem(contact)}
                      className={cssClass}
                    >
                      {avatarWrapper(nativeId, displayName, photos)}
                      <ListItemText
                        id={labelId}
                        primary={`${displayName}`}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              {firstPhoneNumber || firstEmail}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                      {enableSelection &&
                      !isDuplicated &&
                      (shouldBeSynced || shouldBeAddedToDevice) ? (
                        <ListItemSecondaryAction>
                          {isSyncing ? (
                            <CircularProgress
                              size={24}
                              className={classes.progress}
                              color="primary"
                            />
                          ) : (
                            <Checkbox
                              edge="start"
                              checked={setChecked(nativeId)}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ "aria-labelledby": labelId }}
                            />
                          )}
                        </ListItemSecondaryAction>
                      ) : null}
                    </ListItem>
                    <Divider
                      variant="inset"
                      component="li"
                      className={classes.devider}
                    />
                  </Fragment>
                );
              })}
            </List>
          );
        }}
      </ContactConsumer>
    );
  }
}

ContactList.propTypes = {
  classes: PropTypes.object.isRequired
};

const enhance = compose(
  withStyles(styles),
  LoaderHOC("allContacts")
);

export default enhance(ContactList);
