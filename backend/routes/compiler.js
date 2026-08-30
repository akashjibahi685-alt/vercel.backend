const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const tempDir = path.join(__dirname, '../temp');

// Ensure temp directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Languages natively executable on this host
const NATIVE_LANGS = new Set(['c', 'cpp', 'c++', 'python', 'python3', 'javascript', 'node', 'js', 'java']);

router.post('/run', async (req, res) => {
  const { code, language, stdin = '', args = '' } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({ error: 'Code is required and cannot be empty.' });
  }
  if (!language) {
    return res.status(400).json({ error: 'Language is required.' });
  }

  const normLang = language.toLowerCase().trim();

  // For unsupported/simulated languages, return immediately with a friendly message
  if (!NATIVE_LANGS.has(normLang)) {
    return res.json({
      output: `Hello World\n`,
      error: null,
      simulated: true,
      timeMs: 1,
      exitCode: 0,
      message: `${language} runtime is not installed on this server. Output is simulated.`,
    });
  }

  const jobId = `${Date.now()}-${Math.floor(Math.random() * 99999)}`;
  const isWindows = process.platform === 'win32';
  let ext = '';
  let command = '';

  switch (normLang) {
    case 'python':
    case 'python3':
      ext = '.py'; command = 'python'; break;
    case 'javascript':
    case 'node':
    case 'js':
      ext = '.js'; command = 'node'; break;
    case 'c':
      ext = '.c'; command = 'gcc'; break;
    case 'cpp':
    case 'c++':
      ext = '.cpp'; command = 'g++'; break;
    case 'java':
      ext = '.java'; command = 'javac'; break;
    default:
      ext = '.txt'; command = 'node';
  }

  const isJava = normLang === 'java';
  const sourceFileName = isJava ? 'Main.java' : `${jobId}${ext}`;
  const filePath = path.join(tempDir, sourceFileName);
  const outPath = path.join(tempDir, isWindows ? `${jobId}.exe` : `${jobId}.out`);
  const stdinPath = path.join(tempDir, `${jobId}_stdin.txt`);

  const cleanup = () => {
    for (const p of [filePath, outPath, stdinPath]) {
      try { if (fs.existsSync(p)) fs.unlinkSync(p); } catch { /* ignore */ }
    }
    // Clean up java .class files
    if (isJava) {
      try { if (fs.existsSync(path.join(tempDir, 'Main.class'))) fs.unlinkSync(path.join(tempDir, 'Main.class')); } catch { /* ignore */ }
    }
  };

  try {
    fs.writeFileSync(filePath, code, 'utf8');
    if (stdin && stdin.trim()) {
      fs.writeFileSync(stdinPath, stdin, 'utf8');
    }

    const argsStr = args && args.trim() ? ` ${args.trim()}` : '';
    const stdinRedir = (stdin && stdin.trim()) ? ` < "${stdinPath}"` : '';

    let execCommand;
    if (normLang === 'c' || normLang === 'cpp' || normLang === 'c++') {
      execCommand = `${command} "${filePath}" -o "${outPath}" && "${outPath}"${argsStr}${stdinRedir}`;
    } else if (isJava) {
      execCommand = `javac "${filePath}" && java -cp "${tempDir}" Main${argsStr}${stdinRedir}`;
    } else {
      execCommand = `${command} "${filePath}"${argsStr}${stdinRedir}`;
    }

    const startTime = Date.now();

    exec(execCommand, {
      timeout: 10000,
      maxBuffer: 1024 * 1024 * 10, // 10MB
      cwd: tempDir,
    }, (error, stdout, stderr) => {
      const timeMs = Date.now() - startTime;
      cleanup();

      if (error) {
        if (error.killed || error.signal === 'SIGTERM') {
          return res.json({
            output: stdout || '',
            error: `Execution Timeout: Program exceeded the 10-second limit.`,
            timeMs,
            exitCode: 124,
          });
        }
        // Compilation or runtime error — still return 200 with error info
        return res.json({
          output: stdout || '',
          error: stderr || error.message || 'Execution failed',
          timeMs,
          exitCode: error.code || 1,
        });
      }

      res.json({
        output: stdout || '',
        error: stderr || null,
        timeMs,
        exitCode: 0,
      });
    });

  } catch (err) {
    cleanup();
    console.error('[Compiler Route] Error:', err.message);
    res.status(500).json({
      error: `Server error during code execution: ${err.message}`,
    });
  }
});

module.exports = router;
