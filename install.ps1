# Instalador de Dr. Unslopovich para Antigravity (Windows PowerShell)
# Uso: irm https://raw.githubusercontent.com/jdsgnrinfo/unsloop-antigravity/main/install.ps1 | iex
$ErrorActionPreference = 'Stop'

$repoUrl = 'https://github.com/jdsgnrinfo/unsloop-antigravity/archive/refs/heads/main.zip'
$targetDir = Join-Path $HOME '.gemini\config\plugins\unslopovich'
$tmpDir = Join-Path ([System.IO.Path]::GetTempPath()) ("unsloop-antigravity-" + [Guid]::NewGuid().ToString('N'))
$zipFile = Join-Path $tmpDir 'repo.zip'

Write-Host '🩺 Instalando Dr. Unslopovich para Antigravity...' -ForegroundColor Cyan

# Verificar Node.js
try {
    $nodeVer = (& node -v 2>$null)
    if (-not $nodeVer) { throw 'Node no encontrado' }
    Write-Host "✓ Node.js detectado: $nodeVer" -ForegroundColor Green
} catch {
    Write-Warning 'No se encontró Node.js en el PATH. Instala Node.js >= 18 para que los hooks y el detector funcionen.'
}

New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null
try {
    Invoke-WebRequest -Uri $repoUrl -OutFile $zipFile -UseBasicParsing
    Expand-Archive -Path $zipFile -DestinationPath $tmpDir -Force

    $extracted = Get-ChildItem -Path $tmpDir -Directory | Select-Object -First 1
    if (-not $extracted) { throw 'No se pudo extraer el paquete descargado.' }

    if (Test-Path $targetDir) {
        Remove-Item -Recurse -Force $targetDir
    }
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null

    foreach ($item in @('plugin.json', 'hooks.json', 'README.md', 'LICENSE', 'assets', 'hooks', 'skills')) {
        $src = Join-Path $extracted.FullName $item
        if (Test-Path $src) {
            Copy-Item -Path $src -Destination (Join-Path $targetDir $item) -Recurse -Force
        }
    }

    Write-Host ''
    Write-Host "✓ Instalado correctamente en: $targetDir" -ForegroundColor Green
    Write-Host '  • Activo globalmente por defecto en todos tus chats de Antigravity.'
    Write-Host '  • Comandos: /unsloop-status | /unsloop-off | /unsloop-on | /unslopovich'
} finally {
    Remove-Item -Recurse -Force $tmpDir -ErrorAction SilentlyContinue
}
