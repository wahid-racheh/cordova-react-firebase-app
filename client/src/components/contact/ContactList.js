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
import LoaderHOC from "../loader/LoaderHOC";

import Initials from "../../utils/Initials";
import { isSmart } from "../../utils/utility";

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

    const avatarWrapper = (firstName, lastName, thumbnail, phoneNumberId) => {
      return isSmart() && thumbnail ? (
        <ListItemAvatar>
          <Avatar alt={`Avatar n°${phoneNumberId + 1}`} src={thumbnail} />
        </ListItemAvatar>
      ) : (
        <Initials text={`${firstName} ${lastName}`} />
      );
    };

    return (
      <ContactConsumer>
        {({ allContacts, enableSelection, handleSelectItem, setChecked }) => {
          return (
            <List className={classes.contacts}>
              {allContacts.map(
                ({
                  phoneNumberId,
                  firstName,
                  lastName,
                  phoneNumbers,
                  thumbnail,
                  shouldBeSynced,
                  shouldBeAddedToDevice,
                  isDuplicated,
                  isSyncing,
                  contactId
                }) => {
                  const labelId = `checkbox-list-secondary-label-${phoneNumberId}`;
                  const firstPhoneNumber =
                    phoneNumbers && phoneNumbers.length && phoneNumbers[0];

                  const cssClass =
                    (!isDuplicated &&
                      ((shouldBeSynced && classes.syncContact) ||
                        (shouldBeAddedToDevice && classes.saveContact))) ||
                    null;

                  return (
                    <Fragment key={contactId}>
                      <ListItem
                        key={contactId}
                        role={undefined}
                        dense
                        button
                        disableRipple={isDuplicated}
                        onClick={handleSelectItem({
                          phoneNumberId,
                          isDuplicated,
                          isSyncing
                        })}
                        className={cssClass}
                      >
                        {avatarWrapper(
                          firstName,
                          lastName,
                          thumbnail,
                          phoneNumberId
                        )}
                        <ListItemText
                          id={labelId}
                          primary={`${firstName} ${lastName}`}
                          secondary={
                            <React.Fragment>
                              <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                              >
                                {firstPhoneNumber &&
                                  firstPhoneNumber.normalizedNumber}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                        {enableSelection && !isDuplicated ? (
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
                                checked={setChecked(phoneNumberId)}
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
                }
              )}
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
