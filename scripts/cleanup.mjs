import { readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const artifactDirectory = 'artifacts';

/**
 * Removes generated verification evidence while preserving source-controlled files.
 *
 * @returns {Promise<void>} Resolves after the artifact directory is clean.
 */
async function clearArtifactOutputs() {
  const entries = await readdir(artifactDirectory, { withFileTypes: true }).catch((error) => {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return [];
    throw error;
  });

  await Promise.all(
    entries
      .filter((entry) => entry.name !== '.gitignore')
      .map((entry) => rm(join(artifactDirectory, entry.name), { force: true, recursive: true })),
  );
}

await clearArtifactOutputs();
