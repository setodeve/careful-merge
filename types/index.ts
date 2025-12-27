export type MergeMethod = 'merge' | 'squash' | 'rebase';

export interface MergeTypeInfo {
  name: string;
  description: string;
  icon: string;
  color: string;
}

export type MergeTypes = Record<MergeMethod, MergeTypeInfo>;
