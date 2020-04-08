###################################################################
#                                                                 #
#                    Start of Kubenetes Update                    #
#                                                                 #
#                         Namespace: web                          #
#                                                                 #
###################################################################


# update sea-mengxin-ml
docker build -t mengxin891029/sea-mengxin-ml:latest -t mengxin891029/sea-mengxin-ml:$GIT_SHA -f ./docker-images/sea/Dockerfile ./docker-images/sea
docker push mengxin891029/sea-mengxin-ml:$GIT_SHA
docker push mengxin891029/sea-mengxin-ml:latest
kubectl apply -f k8s/web/sea-mengxin-ml
kubectl set image --namespace web deployments/sea-mengxin-ml-deployment sea-mengxin-ml=mengxin891029/sea-mengxin-ml:$GIT_SHA


# update httpbin-mengxin-ml
kubectl apply -f k8s/web/httpbin-mengxin-ml


# update tunnel-mengxin-ml
docker build -t mengxin891029/tunnel-mengxin-ml:latest -t mengxin891029/tunnel-mengxin-ml:$GIT_SHA -f ./docker-images/tunnel/Dockerfile ./docker-images/tunnel
docker push mengxin891029/tunnel-mengxin-ml:$GIT_SHA
docker push mengxin891029/tunnel-mengxin-ml:latest
kubectl apply -f k8s/web/tunnel-mengxin-ml
kubectl set image --namespace web deployments/tunnel-mengxin-ml-deployment tunnel-mengxin-ml=mengxin891029/tunnel-mengxin-ml:$GIT_SHA



# update general kubernetes namespace: web
kubectl apply -f k8s/web





###################################################################
#                                                                 #
#                    Start of Kubenetes Update                    #
#                                                                 #
#                         Namespace: tcp                          #
#                                                                 #
###################################################################


# update ssl-mengxin-ml-keyless
docker build -t mengxin891029/keyless:latest -t mengxin891029/keyless:$GIT_SHA -f ./docker-images/keyless/Dockerfile ./docker-images/keyless
docker push mengxin891029/keyless:$GIT_SHA
docker push mengxin891029/keyless:latest
kubectl apply -f k8s/tcp/ssl-mengxin-ml-keyless
kubectl set image --namespace tcp deployments/ssl-mengxin-ml-keyless-deployment ssl-mengxin-ml=mengxin891029/keyless:$GIT_SHA



# update mengxin-sea1-test-vm
kubectl apply -f k8s/tcp/mengxin-sea1-test-vm



# update general kubernetes namespace: tcp
kubectl apply -f k8s/tcp


