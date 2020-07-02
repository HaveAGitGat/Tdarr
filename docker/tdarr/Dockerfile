ARG REPO

FROM ${REPO}:build as binstage
FROM lsiobase/ubuntu:bionic

# set version label
ARG BUILD_DATE
ARG VCS_URL
ARG VENDOR
ARG VERSION

LABEL build_version=""
LABEL maintainer="${VENDOR}"
LABEL org.label-schema.schema-version="1.0"
LABEL org.label-schema.build-date="${BUILD_DATE}"
LABEL org.label-schema.vcs-url="https://github.com/${VCS_URL}"
LABEL org.label-schema.vendor="${VENDOR}"
LABEL org.label-schema.version="${VERSION}"

# add files from binstage
COPY --from=binstage / /

# hardware & library env
ENV \
 DATA=/config \
 LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib/ \
 LIBVA_DRIVERS_PATH="/usr/lib/x86_64-linux-gnu/dri" \
 MONGO_URL=mongodb://localhost:27017/tdarr \
 MONGODB=4.2 \
 NODEJS=12 \
 NODE_ENV=production \
 NVIDIA_DRIVER_CAPABILITIES="compute,video,utility" \
 NVIDIA_VISIBLE_DEVICES="all" \
 TDARR_CCEXTRACTOR=/usr/local/bin/ccextractor \
 TDARR_DATA=/config \
 TDARR_FFMPEG=/usr/local/bin/ffmpeg \
 TDARR_HANDBRAKE=HandBrakeCLI \
 PORT=8265 \ 
 ROOT_URL=http://localhost 
 
# installing runtime & dependencies
RUN \
 echo "**** install runtime & dependencies ****" && \ 
 apt-get update && \
 apt-get install -y \
        curl \
        gnupg \
        software-properties-common \
        wget \
        p7zip-full && \
 apt-get update && \
 add-apt-repository ppa:stebbins/handbrake-releases && \
 wget -qO - https://www.mongodb.org/static/pgp/server-${MONGODB}.asc | apt-key add - && \
 echo 'deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/'${MONGODB}' multiverse' | tee /etc/apt/sources.list.d/mongodb-org-${MONGODB}.list && \
 curl -sL https://deb.nodesource.com/setup_${NODEJS}.x | bash - &&\
 apt-get update && \
 apt-get install -y \
        gcc \
        handbrake-cli \        
	i965-va-driver \
	libcurl4-gnutls-dev \
	libexpat1 \
	libgl1-mesa-dri \
	libglib2.0-0 \
	libgomp1 \
	libharfbuzz0b \
	libleptonica-dev \
	libtesseract-dev \
	libv4l-0 \
	libx11-6 \
	libxcb1 \
	libxext6 \
	libxml2 \
	mongodb-org \
	nodejs \
	perl \
	tesseract-ocr && \
 echo "**** clean up & create a folder for mongodb ****" && \
 mkdir -p /data/db && \
 rm -rf \
	/var/lib/apt/lists/* \
	/var/tmp/*

# copying TDARR release
COPY /Tdarr /app/
COPY /root /

# installing Tdarr dependencies
RUN \
 cd /app/bundle/programs/server && \ 
 npm install
 
EXPOSE ${TDARR_PORT}
