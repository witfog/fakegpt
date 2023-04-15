# FakeGPT

ChatGPT UI 界面部分功能的简单实现。  
Demo: <https://fakegpt.witfog.cn/chat>

## 快速运行

```sh
docker run -d -p 3000:3000 witfog/fakegpt:latest
```

然后可以通过浏览器访问 <http://localhost:3000> ，在菜单栏填入 OpenAI 的 API Key 即可使用。

## Develop

### 运行

```sh
yarn install
yarn dev
```

### Docker 镜像打包

镜像打包

```sh
docker build . -t witfog/fakegpt:latest
```

多平台镜像打包:

```sh
docker buildx build --platform linux/amd64,linux/arm64 . -t witfog/fakegpt:latest --push
```
