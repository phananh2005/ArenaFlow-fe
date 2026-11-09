const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');
const { mkdtempSync, rmSync } = fs;

const repo = path.resolve(__dirname, '../../..');
const hook = path.join(repo, 'docs/agent/hooks/agent-hooks.cjs');
const cases = [
  [{ tool_name: 'Bash', tool_input: { command: 'git status' } }, 0],
  [{ tool_name: 'Bash', tool_input: { command: 'git push --force origin main' } }, 2],
  [{ tool_name: 'Bash', tool_input: { command: 'git push origin master -f' } }, 2],
  [{ tool_name: 'Bash', tool_input: { command: 'git push --force origin feature/test' } }, 0],
  [{ tool_name: 'Bash', tool_input: { command: 'rm -rf build' } }, 0],
  [{ tool_name: 'Bash', tool_input: { command: 'rm -rf /var/data' } }, 2],
  [{ tool_name: 'Bash', tool_input: { command: 'rm -rf D:/workspace/data' } }, 2],
  [{ tool_name: 'Bash', tool_input: { command: 'rm -rf \\\\server\\share' } }, 2],
  [{ tool_name: 'Bash', tool_input: { command: 'rm -r -f ~' } }, 2],
  [{ tool_name: 'Bash', tool_input: { command: 'rm -rf .' } }, 2],
  [{ tool_name: 'Bash', tool_input: { command: 'rm -rf ./*' } }, 2],
  [{ tool_name: 'Bash', tool_input: { command: "echo 'TRUNCATE TABLE t'" } }, 2],
  [{ tool_name: 'Bash', tool_input: { command: "echo 'DROP TABLE IF EXISTS t'" } }, 0],
  [{ tool_name: 'Bash', tool_input: { command: "echo 'DROP TABLE t'" } }, 2],
  [{ tool_name: 'Write', tool_input: {} }, 0],
];
for (const [payload, expected] of cases) {
  const result = spawnSync(process.execPath, [hook, 'guard'], { input: JSON.stringify(payload), encoding: 'utf8' });
  assert.equal(result.status, expected, `${payload.tool_name}: ${payload.tool_input?.command || ''}`);
}
const malformed = spawnSync(process.execPath, [hook, 'guard'], { input: '{', encoding: 'utf8' });
assert.equal(malformed.status, 0, 'invalid input must fail open');
const loggerRoot = mkdtempSync(path.join(os.tmpdir(), 'arenaflow-fe-hook-fixture-'));
try {
  fs.mkdirSync(path.join(loggerRoot, '.git'));
  const logger = spawnSync(process.execPath, [hook, 'logger'], {
    input: JSON.stringify({ cwd: loggerRoot, tool_name: 'Bash', tool_input: { command: 'SENSITIVE_TEST_SENTINEL' } }),
    encoding: 'utf8',
  });
  assert.equal(logger.status, 0);
  const log = fs.readFileSync(path.join(loggerRoot, '.claude/logs/tool-use.jsonl'), 'utf8');
  assert.match(log, /"tool":"Bash"/);
  assert.doesNotMatch(log, /SENSITIVE_TEST_SENTINEL/);
} finally {
  rmSync(loggerRoot, { recursive: true, force: true });
}

// SessionStart: nhắc khi submodule docs/agent/upstream (ArenaFlow-spec) đã khai báo nhưng chưa init.
const sessionEnv = { ...process.env };
delete sessionEnv.CLAUDE_PROJECT_DIR;
const UPSTREAM_HINT = /git submodule update --init/;
function runSessionStart(setup) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'arenaflow-fe-session-fixture-'));
  try {
    fs.mkdirSync(path.join(root, '.git'));
    setup(root);
    const result = spawnSync(process.execPath, [hook, 'session-start'], {
      input: JSON.stringify({ cwd: root }),
      encoding: 'utf8',
      env: sessionEnv,
    });
    assert.equal(result.status, 0, 'session-start must not block');
    return result.stdout;
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
const GITMODULES = '[submodule "docs/agent/upstream"]\n\tpath = docs/agent/upstream\n\turl = https://example.invalid/spec.git\n';
const sessionCases = [
  ['không khai báo submodule', () => {}, false],
  ['khai báo nhưng chưa init', (root) => fs.writeFileSync(path.join(root, '.gitmodules'), GITMODULES), true],
  ['đã init (có .git trong submodule)', (root) => {
    fs.writeFileSync(path.join(root, '.gitmodules'), GITMODULES);
    fs.mkdirSync(path.join(root, 'docs/agent/upstream'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs/agent/upstream/.git'), 'gitdir: ../../../.git/modules/docs/agent/upstream\n');
  }, false],
];
for (const [name, setup, expectHint] of sessionCases) {
  const stdout = runSessionStart(setup);
  assert.equal(UPSTREAM_HINT.test(stdout), expectHint, `session-start upstream: ${name} -> ${stdout}`);
  if (stdout) assert.doesNotThrow(() => JSON.parse(stdout), `session-start output must be one JSON object: ${stdout}`);
}

// SessionStart: nhắc khi submodule đang checkout commit khác con trỏ (gitlink) của nhánh — dùng repo git thật.
const STALE_HINT = /git submodule update(?! --init)/;
function git(cwd, ...args) {
  const result = spawnSync('git', ['-c', 'user.name=fixture', '-c', 'user.email=fixture@example.invalid',
    '-c', 'protocol.file.allow=always', '-c', 'core.autocrlf=false', ...args], { cwd, encoding: 'utf8' });
  assert.equal(result.status, 0, `git ${args.join(' ')}: ${result.stderr}`);
  return result.stdout.trim();
}
const staleRoot = mkdtempSync(path.join(os.tmpdir(), 'arenaflow-fe-stale-fixture-'));
try {
  const spec = path.join(staleRoot, 'spec');
  const fe = path.join(staleRoot, 'fe');
  fs.mkdirSync(spec);
  fs.mkdirSync(fe);
  git(spec, 'init', '-q', '-b', 'main');
  fs.writeFileSync(path.join(spec, 'README.md'), 'v1\n');
  git(spec, 'add', '.');
  git(spec, 'commit', '-q', '-m', 'v1');
  const v1 = git(spec, 'rev-parse', 'HEAD');
  fs.writeFileSync(path.join(spec, 'README.md'), 'v2\n');
  git(spec, 'commit', '-q', '-am', 'v2');
  git(fe, 'init', '-q', '-b', 'main');
  git(fe, 'submodule', 'add', '-q', spec, 'docs/agent/upstream');
  git(fe, 'commit', '-q', '-m', 'add submodule');
  const runFe = () => spawnSync(process.execPath, [hook, 'session-start'], {
    input: JSON.stringify({ cwd: fe }), encoding: 'utf8', env: sessionEnv,
  }).stdout;
  assert.equal(STALE_HINT.test(runFe()), false, 'submodule khớp gitlink -> không nhắc');
  git(path.join(fe, 'docs/agent/upstream'), 'checkout', '-q', v1);
  const staleOut = runFe();
  assert.equal(STALE_HINT.test(staleOut), true, `submodule lệch gitlink -> phải nhắc: ${staleOut}`);
  assert.doesNotThrow(() => JSON.parse(staleOut), 'stale output must be one JSON object');
} finally {
  rmSync(staleRoot, { recursive: true, force: true });
}

process.stdout.write(`PASS: ${cases.length + 2 + sessionCases.length + 2} hook fixtures\n`);
