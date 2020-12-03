# Using GUI in development envorinment;

These instructions are meant for development only. 
They should be run on the repository root and execute the following commands:

1. Run the basic environment using docker-compose (docker-compose.yml)
2. Build an image based on the current repository
3. Start the application container with network and the volume allocation
4. Update the application using "yarn build/start"


On terminal #1:

    sudo docker-compose -f docker-compose.yml -p cs up -d

    sudo docker build -f Dockerfile -t gui_cs_2 .
    
    sudo docker run -d --rm --network cs_default --network-alias gui -v $PWD/docroot:/usr/share/nginx/html gui_cs_2



sudo docker build -f base_Dockerfile -t gui_cs_3 .
sudo docker run -d --rm gui_cs_3
sudo docker exec -it  b4a51b770ce2ca2d4  /bin/sh