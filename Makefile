USERNAME=haveagitgat
REPO=_acc
TAG=dev
VERSION=2.00.13


build-server:
	docker buildx build -f ./Dockerfile -t ${USERNAME}/tdarr${REPO}:${TAG} --build-arg VERSION=$(VERSION) --build-arg MODULE=Tdarr_Server --build-arg ROOT_CP=root_server --platform linux/amd64,linux/arm64,linux/arm/v7 --push .
build-node:
	docker buildx build -f ./Dockerfile -t ${USERNAME}/tdarr_node${REPO}:${TAG} --build-arg VERSION=$(VERSION) --build-arg MODULE=Tdarr_Node --build-arg ROOT_CP=root_node --platform linux/amd64,linux/arm64,linux/arm/v7 --push .