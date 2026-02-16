import { SearchService } from '../../src/search/search.service';
import type { SearchProvider } from '../../src/search/provider/search-provider.interface';
import type { FileHistoryService } from '../../src/search/history/file-history.service';

describe('SearchService', () => {
  let service: SearchService;
  let searchProvider: jest.Mocked<SearchProvider>;
  let historyService: jest.Mocked<Pick<FileHistoryService, 'save' | 'findAll'>>;

  beforeEach(() => {
    searchProvider = { search: jest.fn() };
    historyService = { save: jest.fn(), findAll: jest.fn() };
    service = new SearchService(
      searchProvider,
      historyService as unknown as FileHistoryService,
    );
  });

  describe('search', () => {
    it('should call the search provider with the given query', async () => {
      // Arrange
      searchProvider.search.mockResolvedValue([]);

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

      // Act
      const response = await service.search('frontend');

      // Assert
      expect(response).toEqual(results);
      expect(response).toHaveLength(2);
    });

    it('should save the query to history after a successful search', async () => {
      // Arrange
      searchProvider.search.mockResolvedValue([]);

      // Act
      await service.search('typescript');

      // Assert
      expect(historyService.save).toHaveBeenCalledWith('typescript');
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
      expect(historyService.save).not.toHaveBeenCalled();
    });
  });

  describe('getHistory', () => {
    it('should delegate to the history service', async () => {
      // Arrange
      const history = [
        { query: 'react', timestamp: '2025-01-01T00:00:00.000Z' },
      ];
      historyService.findAll.mockResolvedValue(history);

      // Act
      const result = await service.getHistory();

      // Assert
      expect(result).toEqual(history);
      expect(historyService.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
