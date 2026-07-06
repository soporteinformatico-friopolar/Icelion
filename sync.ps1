param(
    [string]$Mensaje = "Actualizacion Icelion"
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== ICELION SYNC ==="
Write-Host ""

Write-Host "[1/4] Preparando archivos..."
git add .

Write-Host "[2/4] Guardando cambios..."

git diff --cached --quiet

if ($LASTEXITCODE -ne 0) {
    git commit -m "$Mensaje"

    if ($LASTEXITCODE -ne 0) {
        throw "Error al crear el commit."
    }
}
else {
    Write-Host "No hay cambios nuevos para guardar."
}

Write-Host "[3/4] Sincronizando con GitHub..."
git push

if ($LASTEXITCODE -ne 0) {
    throw "Error al sincronizar con GitHub."
}

Write-Host "[4/4] Desplegando Firebase..."
firebase deploy

if ($LASTEXITCODE -ne 0) {
    throw "Error durante el deploy de Firebase."
}

Write-Host ""
Write-Host "=== SINCRONIZACION COMPLETA ==="
Write-Host "GitHub: OK"
Write-Host "Firebase: OK"
Write-Host ""