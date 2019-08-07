exports.compactObject = obj => {
  const data = obj ? obj : {};
  return Object.entries(data).reduce((newObject, [key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      newObject[key] = value;
    }
    return newObject;
  }, {});
};

exports.isEmpty = str => {
  return str.trim() === "";
};

exports.isEmail = email => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(regex);
};
