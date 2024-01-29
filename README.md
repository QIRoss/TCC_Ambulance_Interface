# TCC_Ambulance_Interface

```
docker build -t ambulance_interface_image .
docker run --name ambulance_interface_app -d -p 8000:8000 --network host ambulance_interface_image
```