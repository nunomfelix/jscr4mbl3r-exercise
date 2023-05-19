import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

const mock = new MockAdapter(axios);

const fakeHTML = `
<html>
<head>
    <title>Test Page</title>
</head>
<body>
    <h1>Hello, world!</h1>
</body>
</html>
`;

describe('CLI', () => {
  beforeAll(() => {
    mock.onGet('https://example.com').reply(200, fakeHTML);
  });

  afterAll(() => {
    mock.reset();
  });

  it('scrapes a URL and writes the output to a file', (done) => {
    // Generate a unique filename for the output file
    const outputFilePath = path.join(__dirname, `output_${Date.now()}.json`);

    // Run the CLI command
    const child = spawn('node', ['dist/index.js', 'https://example.com', '-o', outputFilePath]);

    child.on('error', (err) => {
      // If there's an error, fail the test
      done(err);
    });

    child.on('exit', (code) => {
      if (code !== 0) {
        done(new Error(`Process exited with code ${code}`));
      } else {
        // Check that the output file was created
        const fileExists = fs.existsSync(outputFilePath);
        expect(fileExists).toBe(true);

        if (fileExists) {
          // Check that the file content is as expected
          const fileContent = fs.readFileSync(outputFilePath, 'utf8');
          expect(JSON.parse(fileContent)).toMatchSnapshot();
          
          // Delete the file after test
          fs.unlinkSync(outputFilePath);
        }

        done();
      }
    });
  });
});
