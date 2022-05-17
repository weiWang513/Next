# from 441272919721.dkr.ecr.ap-northeast-1.amazonaws.com/blue:nginx
# LABEL maintainer="1378485490@qq.com"
# ENV TZ=Asia/Shanghai
# RUN ln -snf /usr/share/zoneinfo/TZ /etc/localtime && echo TZ /etc/localtime && echo TZ > /etc/timezone
# COPY nginx.conf /etc/nginx/nginx.conf
# COPY out /usr/share/nginx/html
from 441272919721.dkr.ecr.ap-northeast-1.amazonaws.com/blue:node
# LABEL maintainer="1378485490@qq.com"
WORKDIR /app
COPY . .
EXPOSE 3000

ENV PORT 3000

CMD ["node_modules/.bin/next", "start"]
