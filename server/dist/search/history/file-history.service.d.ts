import { OnModuleInit } from '@nestjs/common';
import type { HistoryEntry } from '../search.types';
export declare class FileHistoryService implements OnModuleInit {
    private readonly logger;
    private readonly filePath;
    private entries;
    onModuleInit(): Promise<void>;
    save(query: string): Promise<void>;
    findAll(): Promise<HistoryEntry[]>;
    private load;
    private persist;
}
