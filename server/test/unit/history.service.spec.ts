import * as fs from 'fs/promises';
import { HistoryService } from '../../src/search/history/history.service';
import { MAX_HISTORY_ENTRIES } from '../../src/search/search.types';

jest.mock('fs/promises');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('HistoryService', () => {
  let service: HistoryService;

  beforeEach(() => {
    service = new HistoryService();
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should persist the entry to file', async () => {
      // Arrange
      mockedFs.writeFile.mockResolvedValue(undefined);

      // Act
      await service.save('react');

      // Assert
      expect(mockedFs.writeFile).toHaveBeenCalledTimes(1);
      const written = JSON.parse(
        mockedFs.writeFile.mock.calls[0][1] as string,
      );
      expect(written).toHaveLength(1);
      expect(written[0].query).toBe('react');
      expect(written[0].timestamp).toBeDefined();
    });

    it('should accumulate multiple entries', async () => {
      // Arrange
      mockedFs.writeFile.mockResolvedValue(undefined);

      // Act
      await service.save('react');
      await service.save('vue');

      // Assert
      const written = JSON.parse(
        mockedFs.writeFile.mock.calls[1][1] as string,
      );
      expect(written).toHaveLength(2);
    });

    it('should cap entries at MAX_HISTORY_ENTRIES', async () => {
      // Arrange
      mockedFs.writeFile.mockResolvedValue(undefined);

      // Act
      for (let i = 0; i < MAX_HISTORY_ENTRIES + 10; i++) {
        await service.save(`query-${i}`);
      }

      // Assert
      const entries = await service.findAll();
      expect(entries).toHaveLength(MAX_HISTORY_ENTRIES);
    });
  });

  describe('findAll', () => {
    it('should return entries sorted by timestamp descending', async () => {
      // Arrange
      mockedFs.mkdir.mockResolvedValue(undefined);
      mockedFs.readFile.mockResolvedValue(
        JSON.stringify([
          { query: 'oldest', timestamp: '2025-01-01T00:00:00.000Z' },
          { query: 'newest', timestamp: '2025-01-03T00:00:00.000Z' },
          { query: 'middle', timestamp: '2025-01-02T00:00:00.000Z' },
        ]),
      );
      await service.onModuleInit();

      // Act
      const entries = await service.findAll();

      // Assert — sorted by timestamp DESC
      expect(entries).toHaveLength(3);
      expect(entries[0].query).toBe('newest');
      expect(entries[1].query).toBe('middle');
      expect(entries[2].query).toBe('oldest');
    });

    it('should return a copy (not the internal array)', async () => {
      // Act
      const entries1 = await service.findAll();
      const entries2 = await service.findAll();

      // Assert
      expect(entries1).not.toBe(entries2);
    });
  });

  describe('removeAt', () => {
    it('should remove the entry at the given sorted index', async () => {
      // Arrange — load with explicit timestamps
      mockedFs.mkdir.mockResolvedValue(undefined);
      mockedFs.readFile.mockResolvedValue(
        JSON.stringify([
          { query: 'react', timestamp: '2025-01-01T00:00:00.000Z' },
          { query: 'vue', timestamp: '2025-01-02T00:00:00.000Z' },
          { query: 'angular', timestamp: '2025-01-03T00:00:00.000Z' },
        ]),
      );
      mockedFs.writeFile.mockResolvedValue(undefined);
      await service.onModuleInit();

      // Sorted order: angular(0), vue(1), react(2)
      // Act — remove index 1 → removes vue
      await service.removeAt(1);
      const entries = await service.findAll();

      // Assert
      expect(entries).toHaveLength(2);
      expect(entries[0].query).toBe('angular');
      expect(entries[1].query).toBe('react');
    });

    it('should persist after removing', async () => {
      // Arrange
      mockedFs.writeFile.mockResolvedValue(undefined);
      await service.save('react');
      mockedFs.writeFile.mockClear();

      // Act
      await service.removeAt(0);

      // Assert
      expect(mockedFs.writeFile).toHaveBeenCalledTimes(1);
    });

    it('should do nothing when index is out of bounds (negative)', async () => {
      // Arrange
      mockedFs.writeFile.mockResolvedValue(undefined);
      await service.save('react');
      mockedFs.writeFile.mockClear();

      // Act
      await service.removeAt(-1);
      const entries = await service.findAll();

      // Assert
      expect(entries).toHaveLength(1);
      expect(mockedFs.writeFile).not.toHaveBeenCalled();
    });

    it('should do nothing when index is out of bounds (too high)', async () => {
      // Arrange
      mockedFs.writeFile.mockResolvedValue(undefined);
      await service.save('react');
      mockedFs.writeFile.mockClear();

      // Act
      await service.removeAt(5);
      const entries = await service.findAll();

      // Assert
      expect(entries).toHaveLength(1);
      expect(mockedFs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    it('should remove all entries', async () => {
      // Arrange
      mockedFs.writeFile.mockResolvedValue(undefined);
      await service.save('react');
      await service.save('vue');

      // Act
      await service.clear();
      const entries = await service.findAll();

      // Assert
      expect(entries).toHaveLength(0);
    });

    it('should persist the empty state', async () => {
      // Arrange
      mockedFs.writeFile.mockResolvedValue(undefined);
      await service.save('react');
      mockedFs.writeFile.mockClear();

      // Act
      await service.clear();

      // Assert
      expect(mockedFs.writeFile).toHaveBeenCalledTimes(1);
      const written = JSON.parse(
        mockedFs.writeFile.mock.calls[0][1] as string,
      );
      expect(written).toEqual([]);
    });
  });

  describe('onModuleInit (load)', () => {
    it('should load entries from existing file', async () => {
      // Arrange
      mockedFs.mkdir.mockResolvedValue(undefined);
      mockedFs.readFile.mockResolvedValue(
        JSON.stringify([
          { query: 'react', timestamp: '2025-01-01T00:00:00.000Z' },
          { query: 'vue', timestamp: '2025-01-02T00:00:00.000Z' },
        ]),
      );

      // Act
      await service.onModuleInit();
      const entries = await service.findAll();

      // Assert — sorted by timestamp DESC
      expect(entries).toHaveLength(2);
      expect(entries[0].query).toBe('vue');
      expect(entries[1].query).toBe('react');
    });

    it('should start empty when file does not exist', async () => {
      // Arrange
      mockedFs.mkdir.mockResolvedValue(undefined);
      mockedFs.readFile.mockRejectedValue(new Error('ENOENT'));

      // Act
      await service.onModuleInit();
      const entries = await service.findAll();

      // Assert
      expect(entries).toEqual([]);
    });

    it('should start empty when file has invalid JSON', async () => {
      // Arrange
      mockedFs.mkdir.mockResolvedValue(undefined);
      mockedFs.readFile.mockResolvedValue('invalid json');

      // Act
      await service.onModuleInit();
      const entries = await service.findAll();

      // Assert
      expect(entries).toEqual([]);
    });

    it('should cap loaded entries at MAX_HISTORY_ENTRIES', async () => {
      // Arrange — each entry gets a distinct timestamp
      const oversizedHistory = Array.from(
        { length: MAX_HISTORY_ENTRIES + 50 },
        (_, i) => ({
          query: `query-${i}`,
          timestamp: new Date(2025, 0, 1, 0, 0, i).toISOString(),
        }),
      );
      mockedFs.mkdir.mockResolvedValue(undefined);
      mockedFs.readFile.mockResolvedValue(JSON.stringify(oversizedHistory));

      // Act
      await service.onModuleInit();
      const entries = await service.findAll();

      // Assert — capped to last MAX entries, sorted by timestamp DESC
      expect(entries).toHaveLength(MAX_HISTORY_ENTRIES);
      expect(entries[0].query).toBe(`query-${MAX_HISTORY_ENTRIES + 49}`);
      expect(entries[entries.length - 1].query).toBe('query-50');
    });
  });
});
