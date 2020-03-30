# build docker images
docker build -t mengxin891029/sea-mengxin-ml:latest -t mengxin891029/sea-mengxin-ml:$GIT_SHA -f ./docker-images/sea/Dockerfile ./docker-images/sea
docker build -t mengxin891029/tunnel-mengxin-ml:latest -t mengxin891029/tunnel-mengxin-ml:$GIT_SHA -f ./docker-images/tunnel/Dockerfile ./docker-images/tunnel

# push dokcer images
docker push mengxin891029/sea-mengxin-ml:$GIT_SHA
docker push mengxin891029/sea-mengxin-ml:latest
docker push mengxin891029/tunnel-mengxin-ml:$GIT_SHA
docker push mengxin891029/tunnel-mengxin-ml:latest


# update kubernetes
kubectl apply -f k8s
kubectl set image deployments/sea-mengxin-ml-deployment sea-mengxin-ml=mengxin891029/sea-mengxin-ml:$GIT_SHA
kubectl set image deployments/tunnel-mengxin-ml-deployment tunnel-mengxin-ml=mengxin891029/tunnel-mengxin-ml:$GIT_SHA