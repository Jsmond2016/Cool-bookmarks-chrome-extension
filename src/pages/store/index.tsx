import { Group } from "@src/typings/group";
import { create } from "zustand";

export const useGroupListStore = create<{
  groupList: Group[];
  updateGroupList: (groupList: Group[]) => void;
}>((set) => ({
  groupList: [],
  updateGroupList: (groupList) => set((state) => ({ groupList })),
}));
