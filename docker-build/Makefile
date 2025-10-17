# Root Makefile - Docker build targets only
# Run from repository root
# For test targets, see be/Makefile

include Makefile.vars

VERSION=$(shell sed 's/.*"version": "\(.*\)".*/\1/;t;d' ../package.json)
VD=${VERSION}_${DATE}

# PLATFORMS=linux/amd64
# PLATFORMS=linux/amd64,linux/arm/v7
# linux/amd64,linux/arm64,linux/arm/v7
PLATFORMS=linux/amd64,linux/arm64

# Default to false (use dev packages), can be overridden with make build-be-all-arch USE_PROD_PACKAGES=true
USE_PROD_PACKAGES=false

# BUILD_BASE configuration
BUILD_BASE=true
FIXED_BASE_TAG=2.49.01_2025_10_13T05_02_41z

# PUSH_IMAGES configuration
PUSH_IMAGES=true

# Conditionally set BASE_IMAGE_TAG based on BUILD_BASE
ifeq ($(BUILD_BASE),true)
	BASE_IMAGE_TAG=$(VERSION)_$(DATE)
else
	BASE_IMAGE_TAG=$(FIXED_BASE_TAG)
endif

V_D=--build-arg VERSION=$(VERSION) --build-arg DATE=$(DATE) --build-arg USE_PROD_PACKAGES=$(USE_PROD_PACKAGES) --build-arg BASE_IMAGE_TAG=$(BASE_IMAGE_TAG)

# Conditionally set push flag based on PUSH_IMAGES
ifeq ($(PUSH_IMAGES),true)
	PUSH_FLAG=--push
else
	PUSH_FLAG=
endif

SERVER_TAGS=-t ${SERVER_TAG} -t ${SERVER_TAG}_${VD}

NODE_TAGS=-t ${NODE_TAG} -t ${NODE_TAG}_${VD}

BASE_TAGS=-t ${BASE_TAG} -t ${BASE_TAG}_${VD}

# Multi-architecture builds (conditionally pushes to registry based on PUSH_IMAGES)
build-base-all-arch:
	docker buildx build -f ./docker/Dockerfile.base ${BASE_TAGS} --platform ${PLATFORMS} ${PUSH_FLAG} .

build-be-all-arch:
	docker buildx build -f ./docker/Dockerfile.final ${SERVER_TAGS} --platform ${PLATFORMS} --build-arg MODULE=Tdarr_Server ${V_D} ${PUSH_FLAG} .

build-node-all-arch:
	docker buildx build -f ./docker/Dockerfile.final ${NODE_TAGS} --platform ${PLATFORMS} --build-arg MODULE=Tdarr_Node ${V_D} ${PUSH_FLAG} .

# for much faster x64 builds:
build-base-x64:
	docker build -f ./docker/Dockerfile.base ${BASE_TAGS} .

build-be-x64:
	docker build -f ./docker/Dockerfile.final ${SERVER_TAGS} --build-arg MODULE=Tdarr_Server ${V_D} .

build-node-x64:
	docker build -f ./docker/Dockerfile.final ${NODE_TAGS} --build-arg MODULE=Tdarr_Node ${V_D} .

# Push images to registry
push-base:
	docker push ${BASE_TAG} && docker push ${BASE_TAG}_${VD}

push-be:
	docker push ${SERVER_TAG} && docker push ${SERVER_TAG}_${VD}

push-node:
	docker push ${NODE_TAG} && docker push ${NODE_TAG}_${VD}
