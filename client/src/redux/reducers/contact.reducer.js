import {
  SET_CONTACTS,
  LOADING_CONTACTS,
  MERGE_CONTACTS,
  START_SYNC_ITEM,
  END_SYNC_ITEM,
  START_SYNC,
  STOP_SYNC
} from "../types";

import { mergeContacts, generateContactId } from "../../helpers";
import { sortArray, compactArray, isEmpty } from "../../utils/utility";

const initialState = {
  contacts: [],
  nativeContacts: [],
  itemsToSync: [],
  isMounted: false,
  loading: false,
  isSyncingItems: false,
  syncedItemsCount: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CONTACTS:
      return {
        ...state,
        contacts: action.payload,
        loading: false
      };
    case MERGE_CONTACTS:
      const nativeList = compactArray(action.payload).reduce((acc, item) => {
        const temp = {
          ...item,
          nativeId: generateContactId(item)
        };
        return !isEmpty(temp) ? [...acc, temp] : [...acc];
      }, []);

      const contacts = mergeContacts("nativeId", state.contacts, nativeList, [
        c => !c.shouldBeSynced,
        c => !c.shouldBeAddedToDevice,
        "displayName",
        "nickname"
      ]);

      return {
        ...state,
        nativeContacts: [...action.payload],
        contacts
      };
    case LOADING_CONTACTS:
      return {
        ...state,
        loading: true
      };
    case START_SYNC:
      return {
        ...state,
        itemsToSync: action.payload,
        isSyncingItems: false,
        syncedItemsCount: 0
      };
    case STOP_SYNC:
      return {
        ...state,
        itemsToSync: [],
        isSyncingItems: false,
        syncedItemsCount: 0,
        contacts: [
          ...state.contacts.map(c => {
            c = { ...c, isSyncing: false };
            return c;
          })
        ]
      };
    case START_SYNC_ITEM:
      return {
        ...state,
        isSyncingItems: true,
        contacts: [
          ...state.contacts.map(c => {
            if (c.nativeId === action.payload.nativeId) {
              c = { ...c, isSyncing: true };
            }
            return c;
          })
        ]
      };
    case END_SYNC_ITEM:
      const syncedItemsCount = state.syncedItemsCount + 1;
      const isSyncingItems = !(syncedItemsCount === state.itemsToSync.length);
      return {
        ...state,
        contacts: sortArray(
          [
            ...state.contacts.map(c => {
              if (c.nativeId === action.payload.nativeId) {
                c = {
                  ...c,
                  isSyncing: false,
                  shouldBeSynced: c.shouldBeSynced
                    ? !action.payload.isSuccessfull
                    : c.shouldBeSynced,
                  shouldBeAddedToDevice: c.shouldBeAddedToDevice
                    ? !action.payload.isSuccessfull
                    : c.shouldBeAddedToDevice,
                  isDuplicated: action.payload.isSuccessfull
                };
              }
              return c;
            })
          ],
          [
            c => !c.shouldBeSynced,
            c => !c.shouldBeAddedToDevice,
            "displayName",
            "nickname"
          ]
        ),
        isSyncingItems,
        syncedItemsCount: isSyncingItems ? syncedItemsCount : 0
      };
    default:
      return { ...state };
  }
}
