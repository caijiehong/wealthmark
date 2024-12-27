# 二开推荐阅读[如何提高项目构建效率](https://developers.weixin.qq.com/miniprogram/dev/wxcloudrun/src/scene/build/speed.html)
FROM alpine:3.20

# 容器默认时区为UTC，如需使用上海时间请启用以下时区设置命令
RUN apk add tzdata && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo Asia/Shanghai > /etc/timezone

# 使用 HTTPS 协议访问容器云调用证书安装
RUN apk add ca-certificates

# 安装依赖包，如需其他依赖包，请到alpine依赖包管理(https://pkgs.alpinelinux.org/packages?name=nodejs&branch=v3.20&repo=&arch=&maintainer=)查找。
RUN apk add --update --no-cache nodejs npm python3 py3-pip

# npm 源，选用国内镜像源以提高下载速度
RUN npm config set registry https://mirrors.cloud.tencent.com/npm/

RUN npm i -g pnpm@9

# 升级 pip 到最新版
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

RUN pip install --upgrade pip
# 新增 gunicorn 安装，提升并发和并行能力
RUN pip install --no-cache-dir akshare fastapi uvicorn gunicorn -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host=mirrors.aliyun.com  --upgrade
RUN pip install --no-cache-dir aktools -i https://pypi.org/simple --upgrade

# 将当前目录（dockerfile所在目录）下所有文件都拷贝到工作目录下（.gitignore中的文件除外）
COPY . /workspace

# npm 安装依赖
RUN cd /workspace && sh ./scripts/build.sh

# # 指定工作目录
WORKDIR /workspace

# 执行启动命令.
# 写多行独立的CMD命令是错误写法！只有最后一行CMD命令会被执行，之前的都会被忽略，导致业务报错。
# 请参考[Docker官方文档之CMD命令](https://docs.docker.com/engine/reference/builder/#cmd)
CMD ["npm", "start"]