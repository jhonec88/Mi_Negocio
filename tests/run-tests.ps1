<#
.SYNOPSIS
  Suite de Testing Automatizado y Verificación de Integridad de TecnoFix Colombia.
.DESCRIPTION
  Ejecuta validaciones estáticas, sintácticas, de integridad de enlaces/recursos
  y pruebas funcionales sobre el sitio web TecnoFix.
#>

param(
  [switch]$HeadlessBrowser,
  [switch]$VerboseOutput
)

$ErrorActionPreference = "Stop"
$WorkspaceRoot = Resolve-Path "$PSScriptRoot\.."
$TotalTests = 0
$TotalPassed = 0
$TotalFailed = 0
$FailedDetails = @()

function Write-TestResult {
  param(
    [string]$Suite,
    [string]$Name,
    [bool]$Passed,
    [string]$ErrorMsg = ""
  )
  $script:TotalTests++
  if ($Passed) {
    $script:TotalPassed++
    Write-Host "  [OK] " -ForegroundColor Green -NoNewline
    Write-Host "$Name" -ForegroundColor White
  } else {
    $script:TotalFailed++
    $script:FailedDetails += "[$Suite] $Name -> $ErrorMsg"
    Write-Host "  [FAIL] " -ForegroundColor Red -NoNewline
    Write-Host "$Name : $ErrorMsg" -ForegroundColor Yellow
  }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   TECNOFIX COLOMBIA - SUITE DE TESTING AUTOMATIZADO" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Directorio base: $WorkspaceRoot" -ForegroundColor Gray
Write-Host ""

# -------------------------------------------------------------------------
# SUITE 1: Verificación de Integridad y Existencia de Archivos Estructurales
# -------------------------------------------------------------------------
Write-Host "[1/5] Verificando Archivos Clave del Proyecto..." -ForegroundColor Cyan

$ArchivosRequeridos = @(
  "index.html",
  "servicios.html",
  "productos.html",
  "nosotros.html",
  "preguntas-frecuentes.html",
  "contacto.html",
  "favicon.svg",
  "robots.txt",
  "sitemap.xml",
  "assets\css\variables.css",
  "assets\css\reset.css",
  "assets\css\global.css",
  "assets\css\components.css",
  "assets\css\responsive.css",
  "assets\js\security.js",
  "assets\js\whatsapp.js",
  "assets\js\modal.js",
  "assets\js\servicios.js",
  "assets\js\productos-data.js",
  "assets\js\productos.js",
  "assets\js\filtros.js",
  "assets\js\formulario.js",
  "assets\js\faq.js",
  "assets\js\carrito.js",
  "assets\js\menu.js",
  "assets\js\main.js"
)

foreach ($relPath in $ArchivosRequeridos) {
  $fullPath = Join-Path $WorkspaceRoot $relPath
  $exists = Test-Path $fullPath
  Write-TestResult -Suite "Archivos" -Name "Existe $relPath" -Passed $exists -ErrorMsg "Archivo no encontrado"
}

# -------------------------------------------------------------------------
# SUITE 2: Verificación de Sintaxis y Metadatos en Páginas HTML
# -------------------------------------------------------------------------
Write-Host ""
Write-Host "[2/5] Validando Metadatos SEO, Accesibilidad y JSON-LD..." -ForegroundColor Cyan

$PaginasHtml = @("index.html", "servicios.html", "productos.html", "nosotros.html", "preguntas-frecuentes.html", "contacto.html")

foreach ($htmlFile in $PaginasHtml) {
  $htmlPath = Join-Path $WorkspaceRoot $htmlFile
  $content = Get-Content -Raw -Encoding UTF8 $htmlPath

  # Charset UTF-8
  $hasCharset = $content -match 'charset=["'']?UTF-8'
  Write-TestResult -Suite "HTML-$htmlFile" -Name "$htmlFile contiene charset UTF-8" -Passed $hasCharset -ErrorMsg "Falta meta charset UTF-8"

  # Viewport
  $hasViewport = $content -match 'name=["'']viewport["'']'
  Write-TestResult -Suite "HTML-$htmlFile" -Name "$htmlFile contiene meta viewport responsive" -Passed $hasViewport -ErrorMsg "Falta meta viewport"

  # Title
  $hasTitle = $content -match '<title>([^<]+)</title>'
  Write-TestResult -Suite "HTML-$htmlFile" -Name "$htmlFile contiene etiqueta title" -Passed $hasTitle -ErrorMsg "Falta etiqueta title"

  # Meta Description
  $hasDesc = $content -match 'name=["'']description["'']\s+content=["'']([^"'']+)["'']'
  Write-TestResult -Suite "HTML-$htmlFile" -Name "$htmlFile contiene meta description" -Passed $hasDesc -ErrorMsg "Falta meta description"

  # Lang="es"
  $hasLang = $content -match '<html\s+lang=["'']es["'']'
  Write-TestResult -Suite "HTML-$htmlFile" -Name "$htmlFile tiene atributo lang='es'" -Passed $hasLang -ErrorMsg "Falta atributo lang='es'"

  # JSON-LD Schema si existe
  $schemaMatches = [regex]::Matches($content, '<script\s+type=["'']application/ld\+json["'']>([\s\S]*?)</script>')
  foreach ($match in $schemaMatches) {
    $jsonContent = $match.Groups[1].Value.Trim()
    $jsonValid = $true
    try {
      $null = ConvertFrom-Json $jsonContent -ErrorAction Stop
    } catch {
      $jsonValid = $false
      $errMsg = $_.Exception.Message
    }
    Write-TestResult -Suite "JSON-LD-$htmlFile" -Name "$htmlFile bloque JSON-LD es JSON sintácticamente válido" -Passed $jsonValid -ErrorMsg "Error en schema: $errMsg"
  }
}

# -------------------------------------------------------------------------
# SUITE 3: Verificación de Enlaces a Recursos Estáticos (CSS, JS, IMGs)
# -------------------------------------------------------------------------
Write-Host ""
Write-Host "[3/5] Validando Integridad de Recursos Referenciados en el DOM..." -ForegroundColor Cyan

foreach ($htmlFile in $PaginasHtml) {
  $htmlPath = Join-Path $WorkspaceRoot $htmlFile
  $content = Get-Content -Raw -Encoding UTF8 $htmlPath

  # Hojas de estilo locales
  $cssMatches = [regex]::Matches($content, '<link\s+[^>]*href=["''](assets/css/[^"'']+)["'']')
  foreach ($m in $cssMatches) {
    $ref = $m.Groups[1].Value
    $full = Join-Path $WorkspaceRoot ($ref -replace '/', '\')
    $exists = Test-Path $full
    Write-TestResult -Suite "Recursos-$htmlFile" -Name "$htmlFile -> Hoja de estilo $ref" -Passed $exists -ErrorMsg "CSS no encontrado en disco"
  }

  # Scripts locales
  $jsMatches = [regex]::Matches($content, '<script\s+[^>]*src=["''](assets/js/[^"'']+)["'']')
  foreach ($m in $jsMatches) {
    $ref = $m.Groups[1].Value
    $full = Join-Path $WorkspaceRoot ($ref -replace '/', '\')
    $exists = Test-Path $full
    Write-TestResult -Suite "Recursos-$htmlFile" -Name "$htmlFile -> Script $ref" -Passed $exists -ErrorMsg "JS no encontrado en disco"
  }
}

# -------------------------------------------------------------------------
# SUITE 4: Verificación de Base de Datos Local de Productos e Imágenes
# -------------------------------------------------------------------------
Write-Host ""
Write-Host "[4/5] Validando Catálogo de Productos y Existencia de Imágenes..." -ForegroundColor Cyan

$prodDataPath = Join-Path $WorkspaceRoot "assets\js\productos-data.js"
$prodContent = Get-Content -Raw -Encoding UTF8 $prodDataPath

# Extraer imágenes referenciadas en productos-data
$imgMatches = [regex]::Matches($prodContent, 'imagen:\s*["''](assets/images/productos/[^"'']+)["'']')
Write-TestResult -Suite "Catalogo" -Name "Catálogo tiene al menos 16 productos definidos" -Passed ($imgMatches.Count -ge 16) -ErrorMsg "Se esperaban al menos 16 productos"

foreach ($m in $imgMatches) {
  $imgPath = $m.Groups[1].Value
  $fullImgPath = Join-Path $WorkspaceRoot ($imgPath -replace '/', '\')
  $exists = Test-Path $fullImgPath
  Write-TestResult -Suite "Catalogo-Imágenes" -Name "Imagen de producto existe: $imgPath" -Passed $exists -ErrorMsg "Imagen no existe en disco"
}

# -------------------------------------------------------------------------
# SUITE 5: Ejecución Headless en Microsoft Edge (Test Runner HTML)
# -------------------------------------------------------------------------
Write-Host ""
Write-Host "[5/5] Ejecutando Suite Funcional en Headless Edge..." -ForegroundColor Cyan

$edgePaths = @(
  "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
  "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
)
$edgeExe = $edgePaths | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($edgeExe) {
  $testRunnerPath = Join-Path $WorkspaceRoot.Path "tests\index.html"
  $testRunnerUrl = "file:///" + ($testRunnerPath -replace '\\', '/')
  $tempDump = Join-Path $env:TEMP "tecnofix-test-dump.html"

  try {
    # Ejecuta Edge en modo headless y captura el DOM renderizado
    $process = Start-Process -FilePath $edgeExe -ArgumentList @(
      "--headless",
      "--disable-gpu",
      "--virtual-time-budget=5000",
      "--run-all-compositor-stages-before-draw",
      "--dump-dom",
      $testRunnerUrl
    ) -RedirectStandardOutput $tempDump -Wait -PassThru

    if (Test-Path $tempDump) {
      $dumpContent = Get-Content -Raw -Encoding UTF8 $tempDump
      $passedMatch = [regex]::Match($dumpContent, 'id="stat-passed">(\d+)<')
      $failedMatch = [regex]::Match($dumpContent, 'id="stat-failed">(\d+)<')
      $totalMatch = [regex]::Match($dumpContent, 'id="stat-total">(\d+)<')

      if ($passedMatch.Success -and $failedMatch.Success) {
        $browserPassed = [int]$passedMatch.Groups[1].Value
        $browserFailed = [int]$failedMatch.Groups[1].Value
        $browserTotal = [int]$totalMatch.Groups[1].Value

        if ($browserFailed -gt 0) {
          $failedMatches = [regex]::Matches($dumpContent, '<div class="test-item">\s*<div class="test-item-main">\s*<div class="test-name-group">[\s\S]*?<span>(.*?)</span>[\s\S]*?<div class="test-error-box">(.*?)</div>')
          foreach ($fm in $failedMatches) {
            $tName = $fm.Groups[1].Value.Trim()
            $tErr = $fm.Groups[2].Value.Trim()
            Write-Host "    -> Falló: $tName ($tErr)" -ForegroundColor Red
          }
        }

        Write-TestResult -Suite "EdgeHeadless" -Name "Ejecución de suite interactiva en navegador ($browserPassed de $browserTotal aprobadas)" -Passed ($browserFailed -eq 0 -and $browserTotal -gt 0) -ErrorMsg "$browserFailed pruebas fallidas en navegador"
      } else {
        Write-TestResult -Suite "EdgeHeadless" -Name "Captura de métricas del DOM en Edge" -Passed $false -ErrorMsg "No se pudo leer el DOM"
      }
    }
  } catch {
    Write-TestResult -Suite "EdgeHeadless" -Name "Lanzamiento de Edge Headless" -Passed $false -ErrorMsg $_.Exception.Message
  } finally {
    if (Test-Path $tempDump) { Remove-Item $tempDump -Force -ErrorAction SilentlyContinue }
  }
} else {
  Write-Host "  [SKIP] Microsoft Edge no encontrado para ejecución headless." -ForegroundColor Yellow
}

# -------------------------------------------------------------------------
# RESUMEN FINAL
# -------------------------------------------------------------------------
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "                    RESUMEN DE PRUEBAS" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Total de Pruebas Ejecutadas: $TotalTests" -ForegroundColor White
Write-Host "  Aprobadas (Passed):          $TotalPassed" -ForegroundColor Green
$colorFailed = if ($TotalFailed -eq 0) { "Green" } else { "Red" }
Write-Host "  Fallidas (Failed):           $TotalFailed" -ForegroundColor $colorFailed
Write-Host "============================================================" -ForegroundColor Cyan

if ($TotalFailed -gt 0) {
  Write-Host ""
  Write-Host "Detalle de fallos:" -ForegroundColor Red
  foreach ($fail in $FailedDetails) {
    Write-Host "  - $fail" -ForegroundColor Yellow
  }
  Write-Host ""
  exit 1
} else {
  Write-Host ""
  Write-Host "¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!" -ForegroundColor Green
  Write-Host ""
  exit 0
}
