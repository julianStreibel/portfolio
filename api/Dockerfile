FROM node

WORKDIR /api

COPY . /api

RUN npm install

## THE LIFE SAVER
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

## Launch the wait tool and then your application
CMD /wait && npm start