FROM ubuntu:19.10

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -y apache2
RUN apt install php -y
RUN apt install git -y

RUN cd /var/www/html/ && rm index.html && git clone https://github.com/StevenDouillet/Trollo.git

COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

CMD ["/usr/sbin/apachectl", "-D", "FOREGROUND"]
