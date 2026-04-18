import { create } from "zustand";
import { createUserSlice } from "../features/userSlicer";
import { createFeedSlice } from "../features/workerFeed/feedSlicer";

export const useAppStore = create((...args) => ({
  ...createUserSlice(...args),
  ...createFeedSlice(...args),
}));
