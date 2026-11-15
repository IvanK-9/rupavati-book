import os
import sys
import socket
import http.server
import socketserver
import webbrowser

PORT = 3000

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    local_ip = get_local_ip()
    local_url = f"http://localhost:{PORT}"
    network_url = f"http://{local_ip}:{PORT}"

    print("=" * 64)
    print("   СЕРВЕР ЛЕНДИНГА: РУПАВАТИ • ПИЩА С ЛЮБОВЬЮ")
    print("=" * 64)
    print()
    print(f"💻 На этом компьютере: {local_url}")
    print(f"📱 На планшете и смартфоне по Wi-Fi: {network_url}")
    print()

    # Попытка сгенерировать QR-код для сканирования камерой планшета / телефона
    try:
        import qrcode
        print("📷 Отсканируйте камерой смартфона или планшета:")
        qr = qrcode.QRCode(border=1)
        qr.add_data(network_url)
        qr.print_ascii(invert=True)
    except Exception:
        pass

    print()
    print("Для завершения работы нажмите Ctrl + C")
    print("=" * 64)

    # Автоматически открываем в браузере на ПК
    try:
        webbrowser.open(local_url)
    except Exception:
        pass

    Handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nСервер остановлен.")

if __name__ == "__main__":
    main()
