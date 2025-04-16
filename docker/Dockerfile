# Use an appropriate base image
FROM ubuntu:20.04

# Install necessary packages
RUN apt-get update && apt-get install -y \
    ntp \
    && rm -rf /var/lib/apt/lists/*

# Copy your NTP configuration file
COPY ./ntp.conf /etc/ntp.conf

# Start the NTP service when the container starts
CMD ["service", "ntp", "start"]