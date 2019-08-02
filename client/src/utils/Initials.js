import React from "react";
import { initials } from "./utility";

export default ({ text }) => <div className="initials">{initials(text)}</div>;
