FROM nginx:1.14.0

# RUN unlink /etc/nginx/sites-enabled/default

RUN rm /etc/nginx/conf.d/default.conf

COPY cert /data/cert

COPY static /data/static

COPY templates /data/www

COPY mengxin-ml.conf /etc/nginx/conf.d

# RUN ln -s /etc/nginx/sites-available/mengxin-ml.conf /etc/nginx/sites-enabled/mengxin-ml.conf