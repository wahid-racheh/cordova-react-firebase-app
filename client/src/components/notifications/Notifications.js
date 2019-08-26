import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import Tooltip from "@material-ui/core/Tooltip";

import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";

import { connect } from "react-redux";
import { markNotificationsRead } from "../../redux/actions";

class Notifications extends Component {
  state = {
    anchorEl: null
  };
  handleOpen = event => {
    const { target } = event;
    this.setState(() => {
      return { anchorEl: target };
    });
  };
  handleClose = () => {
    this.setState(() => {
      return { anchorEl: null };
    });
  };
  onMenuOpened = () => {
    let unreadNotificationsIds = this.props.notifications
      .filter(n => !n.read)
      .map(n => n.notificationId);
    !!unreadNotificationsIds.length &&
      this.props.markNotificationsRead(unreadNotificationsIds);
  };
  render() {
    const notifications = this.props.notifications;
    const anchorEl = this.state.anchorEl;
    dayjs.extend(relativeTime);

    let notificationIcon = <NotificationsIcon />;
    if (notifications && !!notifications.length) {
      const unreadNotifications = notifications.filter(n => !n.read);
      !!unreadNotifications.length &&
        (notificationIcon = (
          <Badge badgeContent={unreadNotifications.length} color="secondary">
            <NotificationsIcon />
          </Badge>
        ));
    }

    let notificationsMarkup =
      notifications && !!notifications.length ? (
        notifications.map(n => {
          const verb = n.type === "like" ? "liked" : "commented on";
          const time = dayjs(n.createdAt).fromNow();
          const iconColor = n.read ? "primary" : "secondary";
          const icon =
            n.type === "like" ? (
              <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
            ) : (
              <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
            );

          return (
            <MenuItem key={n.notificationId} onClick={this.handleClose}>
              {icon}
              <Typography
                component={Link}
                color="default"
                variant="body1"
                to={`/users/${n.recipient}/scream/${n.screamId}/${
                  n.notificationId
                }`}
              >
                {n.sender} {verb} your scream {time}
              </Typography>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem onClick={this.handleClose}>
          You have no notifications yet
        </MenuItem>
      );
    return (
      <Fragment>
        <Tooltip placement="top" title="Notifications">
          <IconButton
            aria-owns={anchorEl ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
          >
            {notificationIcon}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          onEntered={this.onMenuOpened}
        >
          {notificationsMarkup}
        </Menu>
      </Fragment>
    );
  }
}

Notifications.propTypes = {
  markNotificationsRead: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired
};
export default connect(
  state => ({
    notifications: state.user.notifications
  }),
  { markNotificationsRead }
)(Notifications);
