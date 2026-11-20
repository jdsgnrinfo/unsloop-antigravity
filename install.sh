#!/usr/bin/env bash
# Instalador de Dr. Unslopovich para Antigravity (macOS y Linux)
# Uso: curl -fsSL https://raw.githubusercontent.com/jdsgnrinfo/unsloop-antigravity/main/install.sh | bash
set -euo pipefail

REPO_URL="https://github.com/jdsgnrinfo/unsloop-antigravity/archive/refs/heads/main.tar.gz"
TARGET_DIR="${HOME}/.gemini/config/plugins/unslopovich"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

echo "🩺 Instalando Dr. Unslopovich para Antigravity..."

if command -v node >/dev/null 2>&1; then
  echo "✓ Node.js detectado: $(node -v)"
else
  echo "⚠️  Advertencia: no se encontró Node.js en el PATH. Instala Node.js >= 18 para que los hooks y el detector funcionen."
fi

curl -fsSL "$REPO_URL" | tar -xz -C "$TMP_DIR"
EXTRACTED="$(find "$TMP_DIR" -mindepth 1 -maxdepth 1 -type d | head -n 1)"

rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"

for item in plugin.json hooks.json README.md LICENSE assets hooks skills; do
  if [ -e "${EXTRACTED}/${item}" ]; then
    cp -R "${EXTRACTED}/${item}" "${TARGET_DIR}/${item}"
  fi
done

echo ""
echo "✓ Instalado correctamente en: ${TARGET_DIR}"
echo "  • Activo globalmente por defecto en todos tus chats de Antigravity."
echo "  • Comandos: /unsloop-status | /unsloop-off | /unsloop-on | /unslopovich"
