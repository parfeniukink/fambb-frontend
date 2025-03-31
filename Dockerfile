FROM node:latest AS builder

ENV PUBLIC_BASE_URL=http://api.budget.homecp:8000

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm run build

EXPOSE 80
ENTRYPOINT ["pnpm"]
CMD ["run", "preview", "--host", "--port", "80"]
