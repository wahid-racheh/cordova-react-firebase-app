import React from "react";
import { initials } from "../../utils/utility";

export default ({ text }) => <div className="initials">{initials(text)}</div>;
