import type { HistoryEntry } from '../search.types';

export const HISTORY_SERVICE = Symbol('HISTORY_SERVICE');

export interface HistoryService {
  save(query: string): Promise<void>;
  findAll(): Promise<HistoryEntry[]>;
}
