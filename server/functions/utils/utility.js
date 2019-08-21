const isEmpty = prop =>
  prop === null ||
  prop === undefined ||
  (prop.hasOwnProperty("length") && prop.length === 0) ||
  (prop.constructor === Object && Object.keys(prop).length === 0);

const isEmail = email => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(regex);
};

const compactObject = obj => {
  const data = !isEmpty(obj) ? obj : {};
  return Object.entries(data).reduce((newObject, [key, value]) => {
    if (!isEmpty(value)) {
      newObject[key] = value;
    }
    return newObject;
  }, {});
};

module.exports = {
  isEmpty,
  isEmail,
  compactObject
};
