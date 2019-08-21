import {
  mergeArrays,
  sortArray,
  isEmpty,
  compactObject,
  mergeUniqueItems,
  isSmart
} from "../utils/utility";
import { isEqual } from "lodash";

import { CONTACT_FIELDS } from "../constants";

const getContactName = ({
  formatted,
  familyName,
  givenName,
  middleName,
  honorificPrefix,
  honorificSuffix
}) => {
  const item = new window.ContactName(
    formatted,
    familyName,
    givenName,
    middleName,
    honorificPrefix,
    honorificSuffix
  );
  return compactObject(item);
};

const getContactOrganization = ({ pref, type, name, dept, title }) => {
  const item = new window.ContactOrganization(pref, type, name, dept, title);
  return compactObject(item);
};

const getContactField = ({ type, value, pref }) => {
  const item = new window.ContactField(type, value, pref);
  return compactObject(item);
};

const getContactAddress = ({
  pref,
  type,
  formatted,
  streetAddress,
  locality,
  region,
  postalCode,
  country
}) => {
  const item = new window.ContactAddress(
    pref,
    type,
    formatted,
    streetAddress,
    locality,
    region,
    postalCode,
    country
  );
  return compactObject(item);
};

const parseContactFields = (array, helper) => {
  const tempArray = !isEmpty(array) ? array : [];
  return tempArray.reduce((acc, item) => {
    const temp = helper(item);
    return !isEmpty(temp) ? [...acc, temp] : [...acc];
  }, []);
};

export const cloneNewContactInstance = ({
  name,
  nickname,
  note,
  birthday,
  displayName,
  addresses,
  categories,
  emails,
  familyName,
  formatted,
  givenName,
  honorificPrefix,
  honorificSuffix,
  ims,
  middleName,
  organizations,
  phoneNumbers,
  photos,
  urls
}) => {
  let newContact = {
    displayName,
    nickname,
    birthday,
    note
  };
  newContact.name = getContactName({
    formatted: (name && name.formatted) || formatted,
    familyName: (name && name.familyName) || familyName,
    givenName: (name && name.givenName) || givenName,
    middleName: (name && name.middleName) || middleName,
    honorificPrefix: (name && name.honorificPrefix) || honorificPrefix,
    honorificSuffix: (name && name.honorificSuffix) || honorificSuffix
  });
  if (!isEmpty(organizations)) {
    newContact.organizations = parseContactFields(
      organizations,
      getContactOrganization
    );
  }
  if (!isEmpty(phoneNumbers)) {
    newContact.phoneNumbers = parseContactFields(phoneNumbers, getContactField);
  }
  if (!isEmpty(emails)) {
    newContact.emails = parseContactFields(emails, getContactField);
  }
  if (!isEmpty(ims)) {
    newContact.ims = parseContactFields(ims, getContactField);
  }
  if (!isEmpty(photos)) {
    newContact.photos = parseContactFields(photos, getContactField);
  }
  if (!isEmpty(categories)) {
    newContact.categories = parseContactFields(categories, getContactField);
  }
  if (!isEmpty(urls)) {
    newContact.urls = parseContactFields(urls, getContactField);
  }
  if (!isEmpty(addresses)) {
    newContact.addresses = parseContactFields(addresses, getContactAddress);
  }
  return newContact;
};

const getContactFindOptions = ({
  filter,
  multiple,
  desiredFields,
  hasPhoneNumber
}) => {
  const item = new window.ContactFindOptions(
    filter,
    multiple,
    desiredFields,
    hasPhoneNumber
  );
  return compactObject(item);
};

const getNativeContacts = (filter, desiredFields) => {
  return new Promise((resolve, reject) => {
    if (isSmart()) {
      window.navigator.contacts.find(
        desiredFields,
        data => {
          resolve(data);
        },
        error => {
          reject(error);
        },
        getContactFindOptions({ filter, multiple: true })
      );
    } else {
      reject({
        error: "Something went wrong while getting native contact list"
      });
    }
  });
};

const getContactDefaultFields = () => {
  const {
    navigator: {
      contacts: { fieldType }
    }
  } = window;
  return mergeUniqueItems(
    CONTACT_FIELDS,
    !isEmpty(fieldType) ? Object.keys(fieldType) : []
  );
};

export const mergeContacts = (idKey, webList, nativeList, sortCriteria) => {
  const defaultKeys = [...getContactDefaultFields(), "nativeId"];
  function getObjectInstance(obj) {
    if (isEmpty(defaultKeys)) {
      return { ...obj };
    }
    const newInstance = {};
    defaultKeys.forEach(key => {
      newInstance[key] = obj[key] || "";
    });
    return newInstance;
  }

  const updateWebList = webList.reduce((acc, item) => {
    let newItem = { ...item, isDuplicated: false };
    const c = nativeList.find(
      e => item[idKey] === e[idKey] || item["id"] === e["id"]
    );
    if (!isEmpty(c)) {
      const c1 = getObjectInstance(item);
      const c2 = getObjectInstance(c);
      newItem = {
        ...item,
        ...c,
        isDuplicated: isEqual(c1, c2)
      };
    }
    return [...acc, newItem];
  }, []);

  const mergedList = mergeArrays(idKey, updateWebList, nativeList);

  const result = mergedList.reduce((acc, item) => {
    const nativeItem = nativeList.find(
      c => c[idKey] === item[idKey] || c["id"] === item["id"]
    );
    const isCloud = !!webList.find(
      c => c[idKey] === item[idKey] || c["id"] === item["id"]
    );
    const isNative = !!nativeItem;
    let newItem = {
      ...item,
      //deviceId: isSmart() ? window.device.uuid : "",
      isSyncing: false,
      shouldBeSynced: !item.isDuplicated && isNative,
      shouldBeAddedToDevice: !item.isDuplicated && !isNative && isCloud
    };
    return [...acc, newItem];
  }, []);
  return sortArray(result, sortCriteria);
};

export const getNativeContactList = () => {
  return new Promise((resolve, reject) => {
    getNativeContacts("", getContactDefaultFields())
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const getNativeContactById = id => {
  return new Promise((resolve, reject) => {
    const parsedId = parseContactId(id);
    getNativeContacts(parsedId, ["name", "displayName", "nickname"])
      .then(data => {
        if (!isEmpty(data)) {
          resolve(data[0]);
        } else {
          reject({ error: "Contact not found" });
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const generateContactId = ({ id, nickname, displayName, name }) => {
  function getId(key, value) {
    return `${key}@$#@$#${value}`;
  }
  return !isEmpty(nickname)
    ? getId("nickname", nickname)
    : !isEmpty(displayName)
    ? getId("displayName", displayName)
    : !isEmpty(name) && !isEmpty(name.displayName)
    ? getId("name.displayName", name.displayName)
    : !isEmpty(name) && !isEmpty(name.formatted)
    ? getId("name.formatted", name.formatted)
    : getId("id", id);
};

export const parseContactId = id => {
  return id.substring(id.lastIndexOf("@$#@$#") + 6, id.length);
};
