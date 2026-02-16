import axios from 'axios';
import { DuckDuckGoProvider } from '../../src/search/provider/duckduckgo.provider';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DuckDuckGoProvider', () => {
  let provider: DuckDuckGoProvider;

  beforeEach(() => {
    provider = new DuckDuckGoProvider();
    jest.clearAllMocks();
  });

  it('should call the DuckDuckGo API with correct parameters and timeout', async () => {
    // Arrange
    mockedAxios.get.mockResolvedValue({
      data: { RelatedTopics: [], Results: [] },
    });

    // Act
    await provider.search('react');

    // Assert
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.duckduckgo.com/',
      { params: { q: 'react', format: 'json', no_html: 1 }, timeout: 10_000 },
    );
  });

  it('should parse RelatedTopics into search results', async () => {
    // Arrange
    mockedAxios.get.mockResolvedValue({
      data: {
        RelatedTopics: [
          {
            Text: 'React - A JavaScript library for building UIs',
            FirstURL: 'https://duckduckgo.com/React',
          },
          {
            Text: 'Vue.js - A progressive framework',
            FirstURL: 'https://duckduckgo.com/Vue.js',
          },
        ],
        Results: [],
      },
    });

    // Act
    const results = await provider.search('frontend');

    // Assert
    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({
      title: 'React',
      url: 'https://duckduckgo.com/React',
    });
    expect(results[1]).toEqual({
      title: 'Vue.js',
      url: 'https://duckduckgo.com/Vue.js',
    });
  });

  it('should flatten grouped topics', async () => {
    // Arrange
    mockedAxios.get.mockResolvedValue({
      data: {
        RelatedTopics: [
          {
            Text: 'Direct - A direct result',
            FirstURL: 'https://example.com/direct',
          },
          {
            Name: 'Group',
            Topics: [
              {
                Text: 'Nested - A nested result',
                FirstURL: 'https://example.com/nested',
              },
            ],
          },
        ],
        Results: [],
      },
    });

    // Act
    const results = await provider.search('test');

    // Assert
    expect(results).toHaveLength(2);
    expect(results[0].title).toBe('Direct');
    expect(results[1].title).toBe('Nested');
  });

  it('should filter out entries without a URL', async () => {
    // Arrange
    mockedAxios.get.mockResolvedValue({
      data: {
        RelatedTopics: [
          { Text: 'Has URL', FirstURL: 'https://example.com' },
          { Text: 'No URL' },
          { Text: '', FirstURL: '' },
        ],
        Results: [],
      },
    });

    // Act
    const results = await provider.search('test');

    // Assert
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Has URL');
  });

  it('should use full text as title when no dash separator exists', async () => {
    // Arrange
    mockedAxios.get.mockResolvedValue({
      data: {
        RelatedTopics: [
          {
            Text: 'Simple topic without dash',
            FirstURL: 'https://example.com',
          },
        ],
        Results: [],
      },
    });

    // Act
    const results = await provider.search('test');

    // Assert
    expect(results[0].title).toBe('Simple topic without dash');
  });

  it('should return empty array for empty response', async () => {
    // Arrange
    mockedAxios.get.mockResolvedValue({
      data: { RelatedTopics: [], Results: [] },
    });

    // Act
    const results = await provider.search('test');

    // Assert
    expect(results).toEqual([]);
  });

  it('should include Results from the response', async () => {
    // Arrange
    mockedAxios.get.mockResolvedValue({
      data: {
        RelatedTopics: [],
        Results: [
          {
            Text: 'Official Site - The official website',
            FirstURL: 'https://official.com',
          },
        ],
      },
    });

    // Act
    const results = await provider.search('test');

    // Assert
    expect(results).toHaveLength(1);
    expect(results[0].url).toBe('https://official.com');
  });

  it('should throw a wrapped error when the API call fails', async () => {
    // Arrange
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));

    // Act & Assert
    await expect(provider.search('fail')).rejects.toThrow(
      'Search provider failed for query "fail"',
    );
  });

  it('should throw a wrapped error on timeout', async () => {
    // Arrange
    mockedAxios.get.mockRejectedValue(new Error('timeout of 10000ms exceeded'));

    // Act & Assert
    await expect(provider.search('slow')).rejects.toThrow(
      'Search provider failed for query "slow"',
    );
  });
});
