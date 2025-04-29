from http.server import HTTPServer, SimpleHTTPRequestHandler
import webbrowser
import os

class MyHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = '/home.html'
        return SimpleHTTPRequestHandler.do_GET(self)

def run(server_class=HTTPServer, handler_class=MyHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Servidor iniciado en http://localhost:{port}")
    # Abrimos la URL específica con el archivo home.html para asegurar que se cargue
    webbrowser.open(f"http://localhost:{port}/home.html")
    httpd.serve_forever()

if __name__ == '__main__':
    run() 