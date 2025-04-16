FROM debian:stable-slim

RUN apt-get update && apt-get install -y ntp && rm -rf /var/lib/apt/lists/*

# Copy the custom NTP configuration file into the container
COPY ntp.conf /etc/ntp.conf

# Start the NTP daemon
CMD ["ntpd", "-n"]