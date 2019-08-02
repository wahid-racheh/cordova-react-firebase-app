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

import { compose } from "recompose";
import LoaderHOC from "../loader/LoaderHOC";

import Initials from "../../utils/Initials";

import { ContactConsumer } from "./ContactContext";

const styles = theme => {
  return {
    ...theme,
    contacts: {
      width: "100%",
      backgroundColor: theme.palette.background.paper
    },
    fab: {
      position: "absolute",
      bottom: 2,
      right: 2
    }
  };
};

class ContactList extends Component {
  render() {
    const { classes } = this.props;

    const avatarWrapper = (firstName, lastName, thumbnail, id) => {
      return thumbnail ? (
        <ListItemAvatar>
          <Avatar alt={`Avatar n°${id + 1}`} src={thumbnail} />
        </ListItemAvatar>
      ) : (
        <Initials text={`${firstName} ${lastName}`} />
      );
    };

    return (
      <ContactConsumer>
        {({ contacts, enableSelection, handleSelectItem, setChecked }) => {
          return (
            <List className={classes.contacts}>
              {contacts.map(
                ({ id, firstName, lastName, phoneNumbers, thumbnail }) => {
                  const labelId = `checkbox-list-secondary-label-${id}`;
                  const firstPhoneNumber =
                    phoneNumbers && phoneNumbers.length && phoneNumbers[0];
                  return (
                    <Fragment key={id}>
                      <ListItem
                        key={id}
                        role={undefined}
                        dense
                        button
                        onClick={handleSelectItem(id)}
                      >
                        {avatarWrapper(firstName, lastName, thumbnail, id)}
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
                        {enableSelection ? (
                          <ListItemSecondaryAction>
                            <Checkbox
                              edge="start"
                              checked={setChecked(id)}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ "aria-labelledby": labelId }}
                            />
                          </ListItemSecondaryAction>
                        ) : null}
                      </ListItem>
                      <Divider variant="inset" component="li" />
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
  LoaderHOC("contacts")
);

export default enhance(ContactList);
