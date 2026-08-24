import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const artifactDir = resolve('artifacts');
const frontendUrl = process.env.FRONTEND_URL ?? 'http://127.0.0.1:3000';

await mkdir(artifactDir, { recursive: true });

let report = {
  passed: false,
  frontendUrl,
  timestamp: new Date().toISOString(),
};

try {
  await execFileAsync('agent-browser', ['open', frontendUrl]);
  const { stdout: snapshot } = await execFileAsync('agent-browser', ['snapshot', '--json']);
  await writeFile(resolve(artifactDir, 'frontend.snapshot.json'), snapshot);
  await execFileAsync('agent-browser', ['screenshot', resolve(artifactDir, 'frontend.png'), '--full']);

  report = {
    ...report,
    passed: snapshot.includes('Agent workspace sample'),
  };
} catch (error) {
  report = {
    ...report,
    error: error instanceof Error ? error.message : String(error),
  };
} finally {
  await execFileAsync('agent-browser', ['close']).catch(() => undefined);
  await writeFile(resolve(artifactDir, 'browser-report.json'), JSON.stringify(report, null, 2) + '\n');
}

if (!report.passed) {
  process.exitCode = 1;
}
