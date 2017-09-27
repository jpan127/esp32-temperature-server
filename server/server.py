import socket			# Sockets
import sys				# Flush
import logging			# Print debug
import json				# Writing data
import os.path			# Checking file path exists
import datetime			# Get current date + time
import pprint			# Pretty print
import time

# Default address
PORT = 11111
IP   = "0.0.0.0"

# Set logging level
logging.basicConfig(level=logging.DEBUG, format='(%(threadName)s) %(message)s',)

# Pretty printer
pp = pprint.PrettyPrinter(indent=4)

# List of all rooms
ROOMS = [ "bedroom", "living_room" ]

"""---------------------------------------------------------------------------------------------"""

""" Data structure that holds all temperature values """
class TemperatureDictionary():

	"""-----------------------------------------------------
	This data structure is organized in JSON format as such:
	\ (dictionary)
		\ room (dictionary)
			\ dates (list)
				\ hour					[0]
				\ average				[1]
				\ entry (dictionary)	[2]
					\ "minute"
					\ "second"
					\ "epoch"
					\ "temp"
	Example:
	    "bedroom": {
	        "9-22-2017": [
	            [
	                11,
	                0.0,
	                [
	                    {
	                        "epoch": 1506106105.0,
	                        "second": 25,
	                        "minute": 48,
	                        "temp": 0
	                    }
	                ]
	            ]
	        ]
	    }
	-----------------------------------------------------"""

	""" Constructor """
	def __init__(self):
		# If previous data exists load that in
		if os.path.exists("data.json"):
			self.file = open("data.json", "r+")
			file_data = self.file.read()
			if len(file_data) > 0:
				# logging.debug("Previous data found, loading data.")
				# sys.stdout.flush()
				self.dict = json.loads(file_data)
			else:
				logging.debug("No previous data, creating new dictionary.")
				sys.stdout.flush()
				self.CreateNewDictionary()
			# Clear all data from over 7 days ago
			self.PruneDictionary(8)
		else:
			self.CreateNewDictionary()

	""" If dictionary doesn't exist create it """
	def CreateNewDictionary(self):
		self.file = None
		self.dict = {}
		# Create an empty dictionary(day) for every room
		for room in ROOMS:
			self.dict[room] = {}
		self.PrintData()

	""" Clear all data from over n days ago """
	def PruneDictionary(self, n):
		for room in ROOMS:
			dates_to_delete = []
			for date in self.dict[room]:
				date_split = date.split('-')
				today = datetime.datetime.today()
				# date_split[1] is the day
				if (today.day - int(date_split[1]) >= n):
					# Mark dates to delete until after loop
					dates_to_delete.append(date)
			# Delete all marked dates to delete
			for dtd in dates_to_delete:
				self.dict[room].pop(dtd, 'None')

	""" Calculate average for the hour """
	def CalculateAverageHour(self, hour):
		average = 0.0
		for entry in hour[2]:
			average += entry["temp"]
		average /= len(hour[2])
		return average

	""" Calculate average for the day """
	def CalculateAverageDay(self, day):
		average = 0.0
		for hour in day:
			average += hour[1]
		average /= len(day)
		return average

	""" Convert epoch to date 								"""
	""" Format is day-of-week month day hour-min-sec year 	"""
	def EpochToDate(self, epoch):
		return datetime.datetime.fromtimestamp(epoch).strftime('%c')

	""" Convert datetime object to epoch """
	def DateToEpoch(self, date):
		return time.mktime(date.timetuple())

	""" Insert new entry into dictionary """
	def AddData(self, room, data):
		# Make sure room parameter is valid
		if room not in ROOMS:
			logging.error("Can't add data to an invalid room!")
			return
		else:
			# Get timestamp
			date_time = datetime.datetime.now()
			# Date used as key in dictionary
			date 	  = "%s-%s-%s" % (date_time.month, date_time.day, date_time.year)
			epoch 	  = self.DateToEpoch(date_time) * 1000
			# Create a list for the entry
			hour 	  = [ date_time.hour, 0.0, [] ]
			minute 	  = date_time.minute
			second 	  = date_time.second

			entry 	  		= {}
			entry["minute"] = minute
			entry["second"] = second
			entry["epoch"]  = epoch
			entry["temp"]   = data

			# Check if key (date) exists
			if date not in self.dict[room]:
				self.dict[room][date] = []

			# Then check if hour exists
			for i, h in enumerate(self.dict[room][date]):
				if h[0] == date_time.hour:
					# The format of the hours is [hour, [entry, entry, ...]]
					self.dict[room][date][i][2].append(entry)
					# Calculate averages
					average = self.CalculateAverageHour(self.dict[room][date][i])
					# Update average
					self.dict[room][date][i][1] = average
					return

			# Hour does not exist
			hour[1] = entry["temp"]
			hour[2].append(entry)
			self.dict[room][date].append(hour)
				

	""" Pretty print """
	def PrintData(self):
		print()
		print(json.dumps(self.dict, indent=4))
		print()
		sys.stdout.flush()

	""" Save to file and exit """
	def Close(self):
		if self.file:
			self.file.seek(0)
			json.dump(self.dict, self.file, indent=4)
			self.file.truncate()
			self.file.close()
		else:
			with open("data.json", "w") as new_file:
				json.dump(self.dict, new_file, indent=4)

"""---------------------------------------------------------------------------------------------"""

""" Opens a UDP socket in server mode """
class UdpServer():

	def init(self, port=PORT, ip=IP):
		self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
		self.sock.settimeout(1)
		self.port = port
		self.ip   = ip
		self.sock.bind((self.ip, self.port))
		logging.debug("UDP Socket initialized.")
		logging.debug("Listening on port: %i", self.port)
		sys.stdout.flush()

	def ParseData(self, data):
		# Make sure the data is type string
		if type(data) not in [str]:
			data = data.decode()
		# Split data by comma
		values = data.split(',')

		if values[0] not in ROOMS:
			logging.error("Missing or invalid room!")
			return None, None
		elif float(values[1]) < 0 or float(values[1]) > 120:
			logging.error("Missing or invalid temperature!")
			return None, None
		else:
			return values[0], float(values[1])

	def listen(self):
		try:
			while True:
				data, addr = self.sock.recvfrom(4096)
				if data:
					room, temp = self.ParseData(data)
					logging.debug("From: %s | Room: %s | Temperature: %f", addr, room, temp)
					sys.stdout.flush()
					temp_dict = TemperatureDictionary()
					temp_dict.AddData(room, temp)
					temp_dict.Close()
				else:
					break
		except socket.timeout as e:
			pass
		except Exception as e:
			raise

	def close(self):
		logging.debug("Closing socket: %i", self.port)
		sys.stdout.flush()
		self.sock.close()

"""---------------------------------------------------------------------------------------------"""

# For running just the UDP server socket
def main():
	udp_server = UdpServer()
	udp_server.init()
	while True:
		udp_server.listen()


if __name__ == "__main__":
	main()