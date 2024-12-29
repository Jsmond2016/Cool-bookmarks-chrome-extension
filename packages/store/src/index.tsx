import type { Group } from '@extension/types';
import { create } from 'zustand';

export const useGroupListStore = create<{
  groupList: Group[];
  updateGroupList: (groupList: Group[]) => void;
}>(set => ({
  groupList: [],
  updateGroupList: groupList => set(() => ({ groupList })),
}));
