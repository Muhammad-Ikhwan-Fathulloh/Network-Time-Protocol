FROM debian:stable-slim

# Install NTP
RUN apt-get update && \
    apt-get install -y --no-install-recommends ntp && \
    rm -rf /var/lib/apt/lists/*

# Salin file konfigurasi ntp.conf ke dalam container
COPY ntp.conf /etc/ntp.conf

# Expose port NTP (UDP 123)
EXPOSE 123/udp

# Jalankan ntpd tanpa daemon mode (-n), dan non-root clock set (-g)
# Opsi -g memungkinkan sinkronisasi meski offset besar
CMD ["ntpd", "-n", "-g"]
