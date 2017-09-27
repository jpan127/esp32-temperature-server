import http.server
import socketserver
import threading
import logging
import sys
from time import sleep
from server import UdpServer # my file

PORT = 11111

def host_http_server():
	logging.debug("Creating HTTP Server...")
	handler = http.server.SimpleHTTPRequestHandler
	httpd   = socketserver.TCPServer(("", PORT), handler)
	# Start running
	logging.debug("Serving on port: %i", PORT)
	sys.stdout.flush()
	httpd.serve_forever()

def listen_udp_port():
	logging.debug("Creating UDP port...")
	udp_server = UdpServer()
	udp_server.init()
	while True:
		udp_server.listen()

def main():
	threads = []
	thread1 = threading.Thread(target=host_http_server)
	thread2 = threading.Thread(target=listen_udp_port)
	thread1.daemon = True
	thread2.daemon = True
	threads.append(thread1)
	threads.append(thread2)
	thread1.start()
	thread2.start()

	# Keep main thread alive
	logging.debug("Main thread sleeping...")
	try:
		while threading.active_count() > 0:
			sleep(0.001)
	except KeyboardInterrupt:
		logging.debug("Received KeyboardInterrupt...")
		logging.debug("Closing all threads.")
		sys.exit()

if __name__ == "__main__":
	main()