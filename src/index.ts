#!/usr/bin/env node

import { program } from 'commander';
import { scrapeUrl } from './scrape';

program
  .version('0.0.1')
  .arguments('<url>')
  .option('-o, --output <output>', 'Output file for JSON result')
  .action((url, options) => {
    scrapeUrl(url, options.output);
  })
  .parse(process.argv);
