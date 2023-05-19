import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

interface TagInfo {
  count: number;
  attributes: { [key: string]: number };
  children: { [key: string]: number };
}

interface ScrapeInfo {
  tags: { [key: string]: TagInfo };
  resources: { [key: string]: number };
  maxDepth: number;
}

async function scrapeUrl(url: string, outputFile?: string) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $: cheerio.Root = cheerio.load(html);
    
    // Initialize the meta information object
    const info: ScrapeInfo = {
      tags: {},
      resources: {},
      maxDepth: 0,
    };

    let tagInfo: TagInfo | undefined;

    // Recursive function to traverse the DOM
    function traverse(node: cheerio.Element, depth: number) {
      // Set maxDepth
      if (node.type !== 'tag') {
        return;
      }
    
      if (depth > info.maxDepth) {
        info.maxDepth = depth;
      }

      const tagName = node.tagName;

      // Initialize tag in info object
      if (!info.tags[tagName]) {
        info.tags[tagName] = {
          count: 0,
          attributes: {},
          children: {},
        };
      }

      // Cache reference to current tag info
      tagInfo = info.tags[tagName];

      // Increment tag count
      tagInfo.count += 1;

      // Count attributes
      if (node.attribs) {
        for (let attr in node.attribs) {
          if (!tagInfo.attributes[attr]) {
            tagInfo.attributes[attr] = 1;
          }

          // Detect resources
          ['src', 'href'].forEach((resourceAttr) => {
            const resource = node.attribs[resourceAttr];
            if (resource && resource.startsWith('http')) {
              if (!info.resources[resource]) {
                info.resources[resource] = 0;
              }
              info.resources[resource] += 1;
            }
          });
        }
      }

      // Count children
      $(node).children().each((_, child: cheerio.Element) => {
        if (child.type !== 'tag') {
          return;
        }
      
        const childName = child.tagName;
        if (!tagInfo.children[childName]) {
          tagInfo.children[childName] = 0;
        }
        tagInfo.children[childName] += 1;
      
        // Recursively traverse child node
        traverse(child, depth + 1);
      });
    }

    // Start traversal with the root node
    traverse($('html')[0], 0);

    const output = JSON.stringify(info, null, 2);

    if (outputFile) {
      fs.writeFile(outputFile, output, (err) => {
        if (err) {
          console.error(`Error while writing to file ${outputFile}: ${err.message}`);
        } else {
          console.log(`Scrape results have been written to ${outputFile}`);
        }
      });
    } else {
      console.log(output);
    }
    
  } catch (error: any) {
    const message: string = error?.message ? error.message : 'An unknown error occurred.';
    console.error(`Error while fetching ${url}: ${message}`);
  }
}

export { scrapeUrl };
