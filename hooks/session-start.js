'use strict';

// Hook SessionStart de Dr. Unslopovich para Antigravity (Windows, macOS y Linux)
const {
  PLUGIN_ROOT,
  readHookInput,
  writeEmptyHookOutput,
  writeInjectSystemMessage,
  isEnabled,
  saveSessionState,
  formatBadge,
  getInstructions,
} = require('./common');

try {
  const data = readHookInput();
  const conversationId = data && data.conversationId ? String(data.conversationId) : '';
  const enabled = isEnabled();

  saveSessionState(conversationId, {
    initialized: true,
    injectedEnabled: enabled,
    lastTurnKey: '',
    startedAt: new Date().toISOString(),
  });

  if (!enabled) {
    writeEmptyHookOutput();
    process.exit(0);
  }

  const instructions = getInstructions(PLUGIN_ROOT);
  const badge = formatBadge(true, 'activo globalmente');
  writeInjectSystemMessage(instructions, badge);
} catch {
  writeEmptyHookOutput();
}
process.exit(0);
