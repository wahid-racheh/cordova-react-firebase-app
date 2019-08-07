import {
  SET_CONTACTS,
  LOADING_CONTACTS,
  MERGE_CONTACTS,
  START_SYNC_ITEM,
  END_SYNC_ITEM,
  START_SYNC,
  STOP_SYNC
} from "../types";

import { mergeContacts } from "../../utils/helpers";
import { sortArray } from "../../utils/utility";

const initialState = {
  contacts: [],
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
      return {
        ...state,
        contacts: [
          ...mergeContacts("phoneNumberId", state.contacts, action.payload, [
            c => !c.shouldBeSynced,
            c => !c.shouldBeAddedToDevice,
            "displayName"
          ])
        ]
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
            if (c.phoneNumberId === action.payload.phoneNumberId) {
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
              if (c.phoneNumberId === action.payload.phoneNumberId) {
                c = {
                  ...c,
                  isSyncing: false,
                  shouldBeSynced: !action.payload.isSuccessfull,
                  isDuplicated: action.payload.isSuccessfull
                };
              }
              return c;
            })
          ],
          [c => !c.shouldBeSynced, c => !c.shouldBeAddedToDevice, "displayName"]
        ),
        isSyncingItems,
        syncedItemsCount: isSyncingItems ? syncedItemsCount : 0
      };
    default:
      return { ...state };
  }
}
