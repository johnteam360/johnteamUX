# Script para corregir archivos HTML corruptos en proyectos/
# Este script elimina el contenido duplicado y agrega footer + WhatsApp bubble

# Footer est\u00e1ndar
$footer = @'

    <footer class="footer" id="footer">
        <div class="container footer-container">
            <div class="footer-section footer-accordion">
                <h3 class="footer-title">
                    <span>Contacto</span>
                    <i class="fas fa-chevron-down footer-icon"></i>
                </h3>
                <div class="footer-content">
                    <ul>
                        <li><i class="fas fa-envelope"></i> <a href="mailto:johnteam380@gmail.com">johnteam380@gmail.com</a></li>
                        <li><i class="fas fa-phone"></i> <a href="tel:+573189526675">+57 318 952 6675</a></li>
                        <li><i class="fas fa-map-marker-alt"></i> Bogotá, Colombia</li>
                    </ul>
                    <div class="social-icons">
                        <a href="#" aria-label="Facebook JohnTeam" target="_blank" rel="noopener">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://www.instagram.com/johnteam.ai/" target="_blank" rel="noopener" aria-label="Instagram JohnTeam">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="https://www.youtube.com/@Johnteamzai" target="_blank" rel="noopener" aria-label="YouTube JohnTeam">
                            <i class="fab fa-youtube"></i>
                        </a>
                    </div>
                </div>
            </div>

            <div class="footer-section footer-accordion">
                <h3 class="footer-title">
                    <span>Enlaces de Interés</span>
                    <i class="fas fa-chevron-down footer-icon"></i>
                </h3>
                <div class="footer-content">
                    <div class="footer-links-grid">
                        <div class="footer-links-col">
                            <h4>Navegación</h4>
                            <ul>
                                <li><a href="../servicios.html">Servicios</a></li>
                                <li><a href="../portafolio.html">Portafolio</a></li>
                                <li><a href="../quienes-somos.html">Quiénes Somos</a></li>
                                <li><a href="../blog.html">Blog</a></li>
                            </ul>
                        </div>
                        <div class="footer-links-col">
                            <h4>Legal</h4>
                            <ul>
                                <li><a href="../politica-privacidad.html">Política de Privacidad</a></li>
                                <li><a href="../terminos-condiciones.html">Términos y Condiciones</a></li>
                                <li><a href="../politica-cookies.html">Política de Cookies</a></li>
                                <li><a href="../aviso-legal.html">Aviso Legal</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; 2025 JohnTeam. Todos los derechos reservados. Potenciado por IA.</p>
        </div>
    </footer>

    <a href="https://wa.me/573189526675" class="whatsapp-bubble" target="_blank" rel="noopener" aria-label="Contactar por WhatsApp">
        <i class="fab fa-whatsapp"></i>
    </a>
    <script type="module" src="../script.js"></script>
</body>
</html>
'@

# Archivos a corregir (excluyendo el ya corregido)
$archivos = @(
    "sistema-automatizacion-ia.html",
    "sistema-web-corporativo.html",
    "cms-consultorio-privado.html",
    "sistema-pedidos-tiempo-real.html",
    "sistema-ventas-automatizado.html",
    "plataforma-analisis-politico.html",
    "migracion-wordpress-headless.html"
)

foreach ($archivo in $archivos) {
    $rutaArchivo = ".\proyectos\$archivo"
    
    if (Test-Path $rutaArchivo) {
        Write-Host "Procesando: $archivo" -ForegroundColor Cyan
        
        # Leer el contenido completo
        $contenido = Get-Content $rutaArchivo -Raw -Encoding UTF8
        
        # Encontrar la posición del primer <!DOCTYPE duplicado (que NO sea el inicial)
        $regex = '(?s)(.*?)</div>\s*</div>\s*<!DOCTYPE html>'
        if ($contenido -match $regex) {
            # Extraer el contenido antes de la duplicación
            $contenidoLimpio = ($contenido -split '<!DOCTYPE html>', 2)[0]
            
            # Encontrar donde termina el contenido válido (última etiqueta de cierre antes de la duplicación)
            # Debería ser después de </div> de cta-card y antes de los </aside></div></div></section></main>
            
            # Buscar patrón común de cierre
            $contenidoLimpio = $contenidoLimpio -replace '\s*$', ''  # Eliminar espacios finales
            
            # Agregar cierres correctos si faltan
            if ($ contenidoLimpio -notmatch '</aside>\s*$') {
                $contenidoLimpio += "`r`n                    </aside>"
            }
            if ($contenidoLimpio -notmatch '</div>\s*</div>\s*</section>\s*</main>\s*$') {
                $contenidoLimpio += "`r`n                </div>`r`n            </div>`r`n        </section>`r`n    </main>"
            }
            
            # Agregar footer y cierre
            $archivoFinal = $contenidoLimpio + $footer
            
            # Guardar el archivo corregido
            [System.IO.File]::WriteAllText($rutaArchivo, $archivoFinal, [System.Text.Encoding]::UTF8)
            
            Write-Host "   ✓ Corregido exitosamente!" -ForegroundColor Green
        }
        else {
            Write-Host "   ⚠ No se encontró duplicación (puede estar ya corregido)" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "   ✗ Archivo no encontrado: $rutaArchivo" -ForegroundColor Red
    }
}

Write-Host "`n¡Proceso completado!" -ForegroundColor Green
Write-Host "Archivos procesados: $($archivos.Count)" -ForegroundColor Cyan
