# ssh_tunnel.py
from sshtunnel import SSHTunnelForwarder
import time

ssh_host = 'sapmadandbd.sercoing.cl'
ssh_username = 'sshsapma'
ssh_password = 'yHi6hN35&hSd'
remote_bind_address = 'localhost'
remote_mysql_port = 3306
local_bind_address = 'localhost'
local_bind_port = 3307

try:
    server = SSHTunnelForwarder(
        (ssh_host),
        ssh_username=ssh_username,
        ssh_password=ssh_password,
        remote_bind_address=(remote_bind_address, remote_mysql_port),
        local_bind_address=(local_bind_address, local_bind_port)
    )

    server.start()

    # Mantén el túnel abierto
    while True:
        time.sleep(1)

except Exception as e:
    print(f"Error al establecer el túnel SSH: {e}")
