import { SearchService } from '../../src/search/search.service';
import type { SearchProvider } from '../../src/search/provider/provider.interface';
import type { HistoryRepository } from '../../src/search/history/history.interface';

describe('SearchService', () => {
  let service: SearchService;
  let searchProvider: jest.Mocked<SearchProvider>;
  let historyRepository: jest.Mocked<HistoryRepository>;

  beforeEach(() => {
    searchProvider = { search: jest.fn() };
    historyRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      removeAt: jest.fn(),
      clear: jest.fn(),
    };
    service = new SearchService(searchProvider, historyRepository);
  });

  describe('search', () => {
    it('should call the search provider with the given query', async () => {
      // Arrange
      searchProvider.search.mockResolvedValue([]);
      historyRepository.save.mockResolvedValue(undefined);

      // Act
      await service.search('react');

      // Assert
      expect(searchProvider.search).toHaveBeenCalledWith('react');
    });

    it('should return search results from the provider', async () => {
      // Arrange
      const results = [
        { title: 'React', url: 'https://reactjs.org' },
        { title: 'Vue', url: 'https://vuejs.org' },
      ];
      searchProvider.search.mockResolvedValue(results);
      historyRepository.save.mockResolvedValue(undefined);

      // Act
      const response = await service.search('frontend');

      // Assert
      expect(response).toEqual(results);
      expect(response).toHaveLength(2);
    });

    it('should save the query to history after a successful search', async () => {
      // Arrange
      searchProvider.search.mockResolvedValue([]);
      historyRepository.save.mockResolvedValue(undefined);

      // Act
      await service.search('typescript');

      // Assert
      expect(historyRepository.save).toHaveBeenCalledWith('typescript');
    });

    it('should propagate errors from the search provider', async () => {
      // Arrange
      searchProvider.search.mockRejectedValue(new Error('Provider failure'));

      // Act & Assert
      await expect(service.search('error')).rejects.toThrow('Provider failure');
    });

    it('should not save history when the provider fails', async () => {
      // Arrange
      searchProvider.search.mockRejectedValue(new Error('Provider failure'));

      // Act
      try {
        await service.search('error');
      } catch {
        /* expected */
      }

      // Assert
      expect(historyRepository.save).not.toHaveBeenCalled();
    });

    it('should return results even when history save fails', async () => {
      // Arrange
      const results = [{ title: 'React', url: 'https://reactjs.org' }];
      searchProvider.search.mockResolvedValue(results);
      historyRepository.save.mockRejectedValue(new Error('Disk full'));

      // Act
      const response = await service.search('react');

      // Assert
      expect(response).toEqual(results);
    });
  });

  describe('getHistory', () => {
    it('should delegate to the history repository', async () => {
      // Arrange
      const history = [
        { query: 'react', timestamp: '2025-01-01T00:00:00.000Z' },
      ];
      historyRepository.findAll.mockResolvedValue(history);

      // Act
      const result = await service.getHistory();

      // Assert
      expect(result).toEqual(history);
      expect(historyRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeHistoryEntry', () => {
    it('should delegate to the history repository with the given index', async () => {
      // Arrange
      historyRepository.removeAt.mockResolvedValue(undefined);

      // Act
      await service.removeHistoryEntry(2);

      // Assert
      expect(historyRepository.removeAt).toHaveBeenCalledWith(2);
    });
  });

  describe('clearHistory', () => {
    it('should delegate to the history repository', async () => {
      // Arrange
      historyRepository.clear.mockResolvedValue(undefined);

      // Act
      await service.clearHistory();

      // Assert
      expect(historyRepository.clear).toHaveBeenCalledTimes(1);
    });
  });
});
