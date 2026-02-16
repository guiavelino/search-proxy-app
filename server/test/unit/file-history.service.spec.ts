import * as fs from 'fs/promises';
import { FileHistoryService } from '../../src/search/history/file-history.service';

jest.mock('fs/promises');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('FileHistoryService', () => {
  let service: FileHistoryService;

  beforeEach(() => {
    service = new FileHistoryService();
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should persist the entry to file', async () => {
      // Arrange
      mockedFs.mkdir.mockResolvedValue(undefined);
      mockedFs.writeFile.mockResolvedValue(undefined);

      // Act
      await service.save('react');

      // Assert
      expect(mockedFs.writeFile).toHaveBeenCalledTimes(1);
      const written = JSON.parse(mockedFs.writeFile.mock.calls[0][1] as string);
      expect(written).toHaveLength(1);
      expect(written[0].query).toBe('react');
      expect(written[0].timestamp).toBeDefined();
    });

    it('should accumulate multiple entries', async () => {
      // Arrange
      mockedFs.mkdir.mockResolvedValue(undefined);
      mockedFs.writeFile.mockResolvedValue(undefined);

      // Act
      await service.save('react');
      await service.save('vue');

      // Assert
      const written = JSON.parse(mockedFs.writeFile.mock.calls[1][1] as string);
      expect(written).toHaveLength(2);
    });
  });

  describe('findAll', () => {
    it('should return all saved entries', async () => {
      // Arrange
      mockedFs.mkdir.mockResolvedValue(undefined);
      mockedFs.writeFile.mockResolvedValue(undefined);
      await service.save('react');

      // Act
      const entries = await service.findAll();

      // Assert
      expect(entries).toHaveLength(1);
      expect(entries[0].query).toBe('react');
    });

    it('should return a copy (not the internal array)', async () => {
      // Act
      const entries1 = await service.findAll();
      const entries2 = await service.findAll();

      // Assert
      expect(entries1).not.toBe(entries2);
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

      // Assert
      expect(entries).toHaveLength(2);
      expect(entries[0].query).toBe('react');
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
  });
});
