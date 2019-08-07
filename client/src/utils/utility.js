import { isEqual, sortBy } from "lodash";

export const isEmpty = obj => {
  return (
    obj === null || obj === undefined || obj === "" || obj === [] || obj === {}
  );
};

export const initials = str => {
  const initials = str.match(/\b\w/g) || [];
  return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
};

export const isSmart = () => {
  return (
    !(
      document.URL.indexOf("http://") > -1 ||
      document.URL.indexOf("https://") > -1
    ) && !isEmpty(window.cordova)
  );
};

export const mergeUniqueItems = (...arrays) => {
  let jointArray = [];
  arrays.forEach(array => {
    if (!isEmpty(array)) {
      jointArray = [...jointArray, ...array];
    }
  });
  return Array.from(new Set([...jointArray]));
};

export const mergeArrays = (idKey, ...arrs) => {
  return [].concat(...arrs).reduce((acc, item) => {
    const arr = acc.filter(e => {
      return item[idKey] === e[idKey] || item["id"] === e["id"];
    });
    return !arr.length ? [...acc, item] : acc;
  }, []);
};

export const chunkInefficient = (array, chunkSize) => {
  return [].concat.apply(
    [],
    array.map((elem, i) => {
      return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
    })
  );
};

export const sortArray = (array, sortCriteria) => {
  if (!isEmpty(sortCriteria)) {
    return sortBy(array, sortCriteria);
  }
  return array;
};

export const compactObject = obj => {
  const data = !isEmpty(obj) ? obj : {};
  return Object.entries(data).reduce((newObject, [key, value]) => {
    if (!isEmpty(value)) {
      newObject[key] = value;
    }
    return newObject;
  }, {});
};

export const compactArray = array => {
  const data = !isEmpty(array) ? array : [];
  return data.reduce((newArray, item) => {
    const newItem = compactObject(item);
    return !isEmpty(newItem) ? [...newArray, newItem] : [...newArray];
  }, []);
};
