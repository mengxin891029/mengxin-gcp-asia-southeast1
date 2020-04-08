FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install curl gnupg -y
RUN curl -C - https://pkg.cloudflare.com/pubkey.gpg | apt-key add -
RUN echo 'deb http://pkg.cloudflare.com/ xenial main' | tee /etc/apt/sources.list.d/cloudflare-main.list
RUN curl -C - https://pkg.cloudflare.com/pubkey.gpg | apt-key add -
RUN apt-get update
RUN apt-get install gokeyless -y