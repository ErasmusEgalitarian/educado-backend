//runs with npx ts-node scripts/generate-test-stubs.ts
import fs from "fs";
import path from "path";

const SRC_DIR = path.join(__dirname, "../../strapi/src"); // Source folder
const TEST_DIR = path.join(__dirname, "../test"); // Test folder

function createTestStubs(srcDir: string, testDir: string) {
  const files = fs.readdirSync(srcDir);

  files.forEach((file) => {
    const fullPath = path.join(srcDir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursively handle subfolders
      createTestStubs(fullPath, path.join(testDir, file));
    } else if (file.endsWith(".ts") && !file.endsWith(".test.ts")) {
      // Determine the test file path
      const relativePath = path.relative(SRC_DIR, fullPath);
      const testFile = path.join(
        TEST_DIR,
        relativePath.replace(".ts", ".test.ts")
      );

      // Skip if the test file already exists
      if (!fs.existsSync(testFile)) {
        fs.mkdirSync(path.dirname(testFile), { recursive: true });

        // Basic test template
        const template = `import { /* functions from '${relativePath}' */ } from '../../src/${relativePath.replace(/\\/g, "/")}';

describe('${file}', () => {
  it('should have tests', () => {
    // TODO: write unit tests for ${file}
  });
});
`;

        fs.writeFileSync(testFile, template);
        console.log(`Created test stub: ${testFile}`);
      }
    }
  });
}

// Run the script
createTestStubs(SRC_DIR, TEST_DIR);
