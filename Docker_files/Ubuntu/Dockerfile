FROM ubuntu:18.04

# Replace 1000 with your user / group idd

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get update && apt-get install -y git-core subversion build-essential gcc-multilib sudo

RUN mkdir -p /home/Tdarr && \
    mkdir -p /home/Tdarr/media && \
    mkdir -p /temp && \		
    echo "Tdarr:x:${uid}:${gid}:Tdarr,,,:/home/Tdarr:/bin/bash" >> /etc/passwd && \
    echo "Tdarr:x:${uid}:" >> /etc/group && \
    echo "Tdarr ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/Tdarr && \
    chmod 0440 /etc/sudoers.d/Tdarr && \
    chown ${uid}:${gid} -R /home/Tdarr && \
    chown ${uid}:${gid} -R /temp



RUN apt-get install dbus-x11 packagekit-gtk3-module libcanberra-gtk-module -y
RUN apt-get install dbus libnotify4 libnss3 libxss1 xdg-utils trash-cli  trash-cli libglib2.0-bin gvfs-bin -y

RUN apt install curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
RUN apt install nodejs


RUN apt-get install -y software-properties-common && apt-get update
RUN add-apt-repository ppa:jonathonf/ffmpeg-4 && apt-get update && apt-get -y install ubuntu-restricted-extras
RUN sudo add-apt-repository ppa:stebbins/handbrake-releases && apt-get update
RUN apt-get -y install handbrake-cli ffmpeg libavcodec-extra libdvdnav4 libdvdread4 libavcodec-extra57 gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly ubuntu-restricted-extras

RUN sudo mkdir -p /data/db
RUN sudo apt install -y mongodb-server

RUN sudo apt-get install -y gcc
RUN sudo apt-get install -y libcurl4-gnutls-dev
RUN sudo apt-get install -y tesseract-ocr
RUN sudo apt-get install -y libleptonica-dev
RUN sudo apt-get install -y libtesseract-dev

USER Tdarr
ENV HOME /home/Tdarr
ADD Tdarr $HOME/Tdarr

COPY ./mongodb /etc/init.d/mongodb

RUN sudo chown -R $USER:$USER $HOME/Tdarr/bundle/programs/server/assets/app/ccextractor/ccextractor
RUN sudo chmod +x $HOME/Tdarr/bundle/programs/server/assets/app/ccextractor/ccextractor
RUN sudo chmod a+rwx $HOME/Tdarr/bundle/programs/server/assets/app/ccextractor/ccextractor


RUN sudo chown -R $USER:$USER $HOME/Tdarr/bundle/programs/server/assets/app/ffmpeg/ffmpeg
RUN sudo chmod +x $HOME/Tdarr/bundle/programs/server/assets/app/ffmpeg/ffmpeg
RUN sudo chmod a+rwx $HOME/Tdarr/bundle/programs/server/assets/app/ffmpeg/ffmpeg


ENV ROOT_URL http://localhost

CMD sudo service mongodb start && \
 echo "Mongo started, waiting 10 seconds" && \
 sleep 10 && \
 echo "Tdarr started" && \
 sudo MONGO_URL=mongodb://localhost:27017/Tdarr PORT=8265 ROOT_URL=$ROOT_URL node --max-old-space-size=16384 $HOME/Tdarr/bundle/main.js






