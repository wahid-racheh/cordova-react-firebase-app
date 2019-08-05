import { isEqual, sortBy } from "lodash";

export const initials = str => {
  const initials = str.match(/\b\w/g) || [];
  return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
};

export const isSmart = () => {
  return (
    !(
      document.URL.indexOf("http://") > -1 ||
      document.URL.indexOf("https://") > -1
    ) && !!window.cordova
  );
};

export const mergeArrays = (idKey, objectKeyInstance, ...arrs) => {
  function getObjectInstance(obj) {
    if (!objectKeyInstance) {
      return { ...obj };
    }
    const newInstance = {};
    Object.keys(objectKeyInstance).forEach(key => {
      newInstance[key] = obj[key] || "";
    });
    return newInstance;
  }
  return [].concat(...arrs).reduce((acc, item) => {
    const arr = acc.filter(c => {
      const hasSameId = item[idKey] === c[idKey];
      if (hasSameId) {
        const c1 = getObjectInstance(item);
        const c2 = getObjectInstance(c);
        c.isDuplicated = isEqual(c1, c2);
      }
      return hasSameId;
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
  if (sortCriteria) {
    return sortBy(array, sortCriteria);
  }
  return array;
};
