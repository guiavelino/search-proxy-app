import type { HistoryEntry } from '../search.types';

export const HISTORY_REPOSITORY = Symbol('HISTORY_REPOSITORY');

export interface HistoryRepository {
  save(query: string): Promise<void>;
  findAll(): Promise<HistoryEntry[]>;
}
