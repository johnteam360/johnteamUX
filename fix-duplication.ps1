$proyectos = @(
    "automatizacion-escuela-canina.html",
    "cms-consultorio-privado.html", 
    "migracion-wordpress-headless.html",
    "plataforma-analisis-politico.html",
    "sistema-automatizacion-ia.html",
    "sistema-pedidos-tiempo-real.html",
    "sistema-ventas-automatizado.html",
    "sistema-web-corporativo.html"
)

foreach ($file in $proyectos) {
    $filePath = "$PSScriptRoot\proyectos\$file"
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # Find the first occurrence of </div> before the duplicate <!DOCTYPE
        $firstPart = $content -match '(?s)(.*?)<div class="tech-tags">\s*<!DOCTYPE html>'
        if ($matches) {
            # Split at the duplicate DOCTYPE
            $beforeDuplicate = ($content -split '<!DOCTYPE html>', 2)[0]
            
            # Remove trailing whitespace and incomplete tags
            $beforeDuplicate = $beforeDuplicate -replace '\s*<div class="tech-tags">\s*$', ''
            
            # Get the original first <!DOCTYPE - </head> section
            $header = $content -match '(?s)(<!DOCTYPE html>.*?</head>)'
            $originalHeader = $matches[1]
            
            # Reconstruct with proper structure
            $fixed = $beforeDuplicate
            Write-Host "Arreglado: $file"
        } else {
            Write-Host "No se encontró duplicación en: $file"
        }
    }
}
