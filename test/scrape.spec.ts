import { scrapeUrl } from '../src/scrape';
import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

jest.mock('axios');
jest.mock('fs');

describe('scrapeUrl', () => {
  it('scrapes a URL and produces expected output', async () => {
    // Mock axios response
    (axios.get as jest.Mock).mockResolvedValue({
      data: '<html><head></head><body><h1>Hello, World!</h1></body></html>',
    });

    // Expected output
    const expectedOutput = {
      tags: {
        html: {
          count: 1,
          attributes: {},
          children: {
            head: 1,
            body: 1,
          },
        },
        head: {
          count: 1,
          attributes: {},
          children: {},
        },
        body: {
          count: 1,
          attributes: {},
          children: {
            h1: 1,
          },
        },
        h1: {
          count: 1,
          attributes: {},
          children: {},
        },
      },
      resources: {},
      maxDepth: 2,
    };

    const consoleSpy = jest.spyOn(console, 'log');

    await scrapeUrl('https://example.com');

    expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify(expectedOutput, null, 2));
  });

  it('gracefully handles errors', async () => {
    // Mock axios to throw an error
    (axios.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

    const consoleSpy = jest.spyOn(console, 'error');

    await scrapeUrl('https://example.com');

    expect(consoleSpy).toHaveBeenCalledWith('Error while fetching https://example.com: Network Error');
  });

  it('writes the output to a file when outputFile is provided', async () => {
    // Mock axios response
    (axios.get as jest.Mock).mockResolvedValue({
      data: '<html><head></head><body><h1>Hello, World!</h1></body></html>',
    });

    // Expected output
    const expectedOutput = {
      tags: {
        html: {
          count: 1,
          attributes: {},
          children: {
            head: 1,
            body: 1
          },
        },
        head: {
          count: 1,
          attributes: {},
          children: {}
        },
        body: {
          count: 1,
          attributes: {},
          children: {
            h1: 1,
          },
        },
        h1: {
          count: 1,
          attributes: {},
          children: {},
        },
      },
      resources: {},
      maxDepth: 2,
    };

    const fsSpy = jest.spyOn(fs, 'writeFile');
    fsSpy.mockImplementation((path, data, callback) => callback(null));

    const consoleSpy = jest.spyOn(console, 'log');

    await scrapeUrl('https://example.com', 'output.json');

    expect(fsSpy).toHaveBeenCalledWith('output.json', JSON.stringify(expectedOutput, null, 2), expect.any(Function));
    expect(consoleSpy).toHaveBeenCalledWith('Scrape results have been written to output.json');
  });
});
