import { combineReducers } from "redux";

import user from "./user.reducer";
import scream from "./scream.reducer";
import ui from "./ui.reducer";
import contact from "./contact.reducer";

export default combineReducers({
  user,
  scream,
  UI: ui,
  contact
});
