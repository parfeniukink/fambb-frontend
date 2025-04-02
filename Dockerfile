FROM node:22 AS builder

ENV PUBLIC_BASE_URL=https://api.budget.parfeniukink.space

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 4173
ENTRYPOINT ["pnpm"]
CMD ["run", "preview", "--host"]
