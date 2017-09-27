from datetime import datetime
import time
from server import TemperatureDictionary
import random

random.seed(time.time())

# Date to epoch
# today = datetime.now()
# date = "%s-%s-%s" % (today.month, today.day, today.year)
# print(date)
# epoch = time.mktime(today.timetuple())
# print(epoch)

# Epoch to date
print(datetime.fromtimestamp(1506044264).strftime('%c'))

# Test TemperatureDictionary
t = TemperatureDictionary()

# Test Pruning
# t.PruneDictionary(0)

# Test AddData
for i in range(5):
    t.AddData("bedroom", random.randrange(120))
t.PrintData()

t.Close()