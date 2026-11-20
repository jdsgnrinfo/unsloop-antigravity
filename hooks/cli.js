'use strict';

// Utilidad CLI de respaldo para consultar o cambiar el estado global de Dr. Unslopovich
const { setEnabled, getDiagnostics } = require('./common');

const action = (process.argv[2] || 'status').toLowerCase();

if (action === 'on') {
  const cfg = setEnabled(true);
  process.stdout.write(`${JSON.stringify({ action: 'on', ...cfg }, null, 2)}\n`);
} else if (action === 'off') {
  const cfg = setEnabled(false);
  process.stdout.write(`${JSON.stringify({ action: 'off', ...cfg }, null, 2)}\n`);
} else {
  const diag = getDiagnostics();
  process.stdout.write(`${JSON.stringify(diag, null, 2)}\n`);
}
