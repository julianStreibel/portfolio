# Use an official runtime as a parent image
FROM mysql:5.7

# Set the working directory
WORKDIR /db

# Copy the current directory contents into the container 
COPY . /docker-entrypoint-initdb.d/
