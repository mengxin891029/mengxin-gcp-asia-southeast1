# build docker images
docker build -t mengxin891029/sea-mengxin-ml:latest -t mengxin891029/sea-mengxin-ml:$GIT_SHA -f ./docker-images/sea/Dockerfile ./docker-images/sea
docker build -t mengxin891029/tunnel-mengxin-ml:latest -t mengxin891029/tunnel-mengxin-ml:$GIT_SHA -f ./docker-images/tunnel/Dockerfile ./docker-images/tunnel
docker build -t mengxin891029/keyless:latest -t mengxin891029/keyless:$GIT_SHA -f ./docker-images/keyless/Dockerfile ./docker-images/keyless

# push dokcer images
docker push mengxin891029/sea-mengxin-ml:$GIT_SHA
docker push mengxin891029/sea-mengxin-ml:latest
docker push mengxin891029/tunnel-mengxin-ml:$GIT_SHA
docker push mengxin891029/tunnel-mengxin-ml:latest
docker push mengxin891029/keyless:$GIT_SHA
docker push mengxin891029/keyless:latest


# update kubernetes namespace: web
kubectl apply -f k8s/web

kubectl set image --namespace web deployments/sea-mengxin-ml-deployment sea-mengxin-ml=mengxin891029/sea-mengxin-ml:$GIT_SHA
kubectl set image --namespace web deployments/tunnel-mengxin-ml-deployment tunnel-mengxin-ml=mengxin891029/tunnel-mengxin-ml:$GIT_SHA


# update kubernetes namespace: tcp
kubectl apply -f k8s/tcp
kubectl set image --namespace tcp deployments/ssl-mengxin-ml-keyless-deployment ssl-mengxin-ml=mengxin891029/keyless:$GIT_SHA