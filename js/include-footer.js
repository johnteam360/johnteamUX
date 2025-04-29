document.addEventListener('DOMContentLoaded', function() {
  // Cargar el footer
  fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      const footerPlaceholder = document.getElementById('footer-placeholder');
      if (footerPlaceholder) {
        footerPlaceholder.innerHTML = data;
      } else {
        console.warn('No se encontró el elemento con ID "footer-placeholder" para insertar el footer');
      }
    })
    .catch(error => {
      console.error('Error al cargar el footer:', error);
    });
}); 