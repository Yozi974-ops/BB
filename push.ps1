# ─── push.ps1 — Script de push automatique vers GitHub ───────────────────────
# Usage : .\push.ps1 "message de commit facultatif"
# Si aucun message n'est fourni, le message par défaut horodaté est utilisé.

$git = "C:\Program Files\Git\bin\git.exe"
$msg = if ($args[0]) { $args[0] } else { "update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')" }

Write-Host "🔍 Vérification des changements..." -ForegroundColor Cyan

$status = & $git status --porcelain
if (-not $status) {
    Write-Host "✅ Rien à commiter — le dépôt est déjà à jour." -ForegroundColor Green
    exit 0
}

Write-Host "📦 Ajout de tous les fichiers..." -ForegroundColor Cyan
& $git add -A

Write-Host "💬 Commit : $msg" -ForegroundColor Cyan
& $git commit -m $msg

Write-Host "🚀 Push vers GitHub (main)..." -ForegroundColor Cyan
& $git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Push réussi ! https://github.com/Yozi974-ops/BB" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors du push. Vérifie ton authentification GitHub." -ForegroundColor Red
}
