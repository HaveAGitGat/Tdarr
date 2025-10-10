# Root Makefile - Docker build targets only
# Run from repository root
# For test targets, see be/Makefile

include Makefile.vars

PDIR=
VERSION=$(shell sed 's/.*"version": "\(.*\)".*/\1/;t;d' ./${PDIR}package.json)
VD=${VERSION}_${DATE}

# PLATFORMS=linux/amd64
# PLATFORMS=linux/amd64,linux/arm/v7
# linux/amd64,linux/arm64,linux/arm/v7
PLATFORMS=linux/amd64,linux/arm64

# Default to false (use dev packages), can be overridden with make build-be-all-arch USE_PROD_PACKAGES=true
USE_PROD_PACKAGES=false

V_D=--build-arg VERSION=$(VERSION) --build-arg DATE=$(DATE) --build-arg USE_PROD_PACKAGES=$(USE_PROD_PACKAGES)

SERVER_TAGS=-t ${SERVER_TAG} -t ${SERVER_TAG}_${VD}

NODE_TAGS=-t ${NODE_TAG} -t ${NODE_TAG}_${VD}

BASE_TAGS=-t ${BASE_TAG} -t ${BASE_TAG}_${VD}

# Multi-architecture builds (pushes to registry)
build-base-all-arch:
	docker buildx build -f ./docker/Dockerfile.base ${BASE_TAGS} --platform ${PLATFORMS} --push .

build-be-all-arch:
	docker buildx build -f ./docker/Dockerfile.final ${SERVER_TAGS} --platform ${PLATFORMS} --build-arg MODULE=Tdarr_Server ${V_D} --push .

build-node-all-arch:
	docker buildx build -f ./docker/Dockerfile.final ${NODE_TAGS} --platform ${PLATFORMS} --build-arg MODULE=Tdarr_Node ${V_D} --push .

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
