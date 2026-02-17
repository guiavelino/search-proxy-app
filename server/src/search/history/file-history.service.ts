import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import type { HistoryEntry } from '../search.types';
import { MAX_HISTORY_ENTRIES } from '../search.types';
import type { HistoryService } from './history.interface';

@Injectable()
export class FileHistoryService implements HistoryService, OnModuleInit {
  private readonly logger = new Logger(FileHistoryService.name);
  private readonly filePath = path.resolve(
    process.cwd(),
    'data',
    'history.json',
  );
  private entries: HistoryEntry[] = [];

  async onModuleInit(): Promise<void> {
    await this.load();
  }

  async save(query: string): Promise<void> {
    this.entries.push({ query, timestamp: new Date().toISOString() });

    if (this.entries.length > MAX_HISTORY_ENTRIES) {
      this.entries = this.entries.slice(-MAX_HISTORY_ENTRIES);
    }

    await this.persist();
  }

  async findAll(): Promise<HistoryEntry[]> {
    return [...this.entries];
  }

  private async load(): Promise<void> {
    try {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      const content = await fs.readFile(this.filePath, 'utf-8');
      const raw = JSON.parse(content);

      if (Array.isArray(raw)) {
        this.entries = raw.slice(-MAX_HISTORY_ENTRIES);
        this.logger.log(`Loaded ${this.entries.length} history entries`);
      }
    } catch {
      this.entries = [];
      this.logger.log('No existing history file — starting fresh');
    }
  }

  private async persist(): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(this.entries, null, 2));
  }
}
