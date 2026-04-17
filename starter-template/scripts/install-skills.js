#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

function main() {
  const root = process.cwd();
  const lockPath = path.join(root, 'skills-lock.json');
  if (!fs.existsSync(lockPath)) {
    console.error('No skills-lock.json found at', lockPath);
    process.exit(1);
  }
  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  const skills = lock.skills || {};
  if (Object.keys(skills).length === 0) {
    console.log('No skills defined in skills-lock.json');
    return;
  }
  const skillsDir = path.join(root, '.agents', 'skills');
  fs.mkdirSync(skillsDir, { recursive: true });
  const force = process.argv.includes('--force') || process.env.FORCE === '1';
  for (const [name, meta] of Object.entries(skills)) {
    const dest = path.join(skillsDir, name);
    if (fs.existsSync(dest)) {
      if (force) {
        console.log(`Updating existing skill ${name} in ${dest}`);
        try { cp.execSync(`git -C "${dest}" pull`, { stdio: 'inherit' }); } catch (err) { console.error('git pull failed', err.message); }
      } else {
        console.log(`Skill ${name} already present at ${dest}, skipping (use --force to update)`);
        continue;
      }
    } else {
      if (meta.sourceType === 'github' && meta.source) {
        const repo = `https://github.com/${meta.source}.git`;
        console.log(`Cloning ${name} from ${repo} → ${dest}`);
        try {
          cp.execSync(`git --version`, { stdio: 'ignore' });
        } catch (err) {
          console.error('git not found on PATH. Please install Git and re-run this script.');
          process.exit(2);
        }
        try {
          cp.execSync(`git clone --depth 1 "${repo}" "${dest}"`, { stdio: 'inherit' });
        } catch (err) {
          console.error(`Failed to clone ${meta.source}:`, err.message);
        }
      } else {
        console.log(`Unknown sourceType for skill ${name}, metadata:`, meta);
      }
    }
  }
  console.log('Done. Skills directory:', skillsDir);
}

main();
