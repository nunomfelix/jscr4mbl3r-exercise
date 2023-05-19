# HTML Scraper CLI 

The HTML Scraper is a Command Line Interface (CLI) implemented in Node.js and TypeScript that receives a URL as an input to a remote HTML resource and returns relevant meta-information about the fetched HTML as JSON output.

## Features
The HTML Scraper provides the following meta-information:

- Count of HTML tags grouped by tag name
- Count of attributes per HTML tag
- Types of downloaded resources (script, image, video, etc.) and their origin hosts
- Number and types of children tags per HTML tag type
- The maximum depth of the HTML tree
- The Scraper is capable of handling complex HTML documents and provides detailed output that can be useful in a variety of contexts, including web analysis, SEO, and web performance optimization.

## Installation
Ensure you have Node.js installed, and then clone the repository and install the dependencies:

```bash
git clone git@github.com:nunomfelix/jscr4mbl3r-exercise.git
cd jscr4mbl3r-exercise
yarn install
```
## Building and Running the Project

To build the project run the following:

```bash
yarn build
```

To use the HTML Scraper, pass the URL you want to analyze as an argument to the CLI:

```bash
yarn scrape -- <url>
```
To output the results to a file instead of the console, use the -o or --output option followed by the desired output file name:

```bash
yarn scrape -- <url> -o output.json
```
## Testing
Unit tests are provided to ensure the functionality and robustness of the HTML Scraper. To run the tests, use the following command:

```bash
yarn test
```

## Code Overview

### src/scrape.ts
This is the core of the scraping functionality. It fetches the HTML document at the provided URL, parses it with Cheerio, and analyzes it to extract the relevant meta-information.

### src/index.ts
This file is the main entry point for the CLI. It uses Commander.js to handle command-line arguments and options, and it calls the scrapeUrl function from scrape.ts to perform the actual scraping.