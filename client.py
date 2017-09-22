import socket
import random
import time
import sys
import datetime
	
# Default parameters
PORT  = 11111
IP    = "127.0.0.1"
MSG   = "bedroom, "
BATCH = 5
CYCLE = 5*60

# Must have command line argument for BATCH
if len(sys.argv) < 2:
	print("Error. Missing argument: batch number.")
	sys.exit(1)
else:
	BATCH = int(sys.argv[1])

# Argument 2 is for time
if len(sys.argv) >= 3:
	CYCLE = float(sys.argv[2]) * 60

class UdpClient():
	def send(self, n, msg="HEY", port=PORT, ip=IP):
		for i in range(n):
			sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
			print(datetime.datetime.now(), "Sending:", msg)
			sys.stdout.flush()
			sock.sendto(msg.encode(), (ip, port))
			sock.close()

def main():
	udp = UdpClient()
	random.seed(time.time())

	while True:
		for i in range(BATCH):
			message = MSG + str(random.randrange(70, 80))
			udp.send(1, msg=message)
		time.sleep(CYCLE)

if __name__ == "__main__":
	main()