import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../../src/app.module';
import { SEARCH_PROVIDER } from '../../src/search/provider/provider.interface';
import type { SearchProvider } from '../../src/search/provider/provider.interface';
import { HISTORY_REPOSITORY } from '../../src/search/history/history.interface';
import type { HistoryRepository } from '../../src/search/history/history.interface';
import { validationPipeConfig } from '../../src/app.config';

describe('SearchController (integration)', () => {
  let app: INestApplication;
  let searchProvider: jest.Mocked<SearchProvider>;
  let mockHistoryRepository: jest.Mocked<HistoryRepository>;

  const mockResults = [
    { title: 'React', url: 'https://reactjs.org' },
    { title: 'Vue', url: 'https://vuejs.org' },
  ];

  beforeAll(async () => {
    searchProvider = {
      search: jest.fn().mockResolvedValue(mockResults),
    };

    mockHistoryRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findAll: jest.fn().mockResolvedValue([
        { query: 'react', timestamp: '2025-01-01T00:00:00.000Z' },
      ]),
      removeAt: jest.fn().mockResolvedValue(undefined),
      clear: jest.fn().mockResolvedValue(undefined),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(SEARCH_PROVIDER)
      .useValue(searchProvider)
      .overrideProvider(HISTORY_REPOSITORY)
      .useValue(mockHistoryRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(validationPipeConfig());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /search', () => {
    it('should return search results for a valid query', async () => {
      // Act
      const response = await supertest(app.getHttpServer())
        .get('/search')
        .query({ q: 'react' });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toEqual({
        title: 'React',
        url: 'https://reactjs.org',
      });
    });

    it('should return 400 when query is missing', async () => {
      // Act & Assert
      const response = await supertest(app.getHttpServer()).get('/search');
      expect(response.status).toBe(400);
    });

    it('should return 400 when query is empty', async () => {
      // Act & Assert
      const response = await supertest(app.getHttpServer())
        .get('/search')
        .query({ q: '' });
      expect(response.status).toBe(400);
    });
  });

  describe('POST /search', () => {
    it('should return search results for a valid body', async () => {
      // Act
      const response = await supertest(app.getHttpServer())
        .post('/search')
        .send({ q: 'react' });

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveLength(2);
    });

    it('should return 400 when body is missing query', async () => {
      // Act & Assert
      const response = await supertest(app.getHttpServer())
        .post('/search')
        .send({});
      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid fields in body', async () => {
      // Act & Assert
      const response = await supertest(app.getHttpServer())
        .post('/search')
        .send({ q: 'react', invalid: 'field' });
      expect(response.status).toBe(400);
    });
  });

  describe('GET /search/history', () => {
    it('should return the search history', async () => {
      // Act
      const response = await supertest(app.getHttpServer()).get(
        '/search/history',
      );

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toEqual({
        query: 'react',
        timestamp: '2025-01-01T00:00:00.000Z',
      });
    });
  });

  describe('DELETE /search/history/:index', () => {
    it('should remove a specific history entry', async () => {
      // Act
      const response = await supertest(app.getHttpServer()).delete(
        '/search/history/0',
      );

      // Assert
      expect(response.status).toBe(200);
      expect(mockHistoryRepository.removeAt).toHaveBeenCalledWith(0);
    });

    it('should return 400 for non-numeric index', async () => {
      // Act & Assert
      const response = await supertest(app.getHttpServer()).delete(
        '/search/history/abc',
      );
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /search/history', () => {
    it('should clear all history', async () => {
      // Act
      const response = await supertest(app.getHttpServer()).delete(
        '/search/history',
      );

      // Assert
      expect(response.status).toBe(200);
      expect(mockHistoryRepository.clear).toHaveBeenCalled();
    });
  });
});
