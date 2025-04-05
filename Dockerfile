FROM node:22 AS builder

ENV PUBLIC_BASE_URL=https://api.budget.parfeniukink.space

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm run build


FROM node:22 as static
COPY --from=builder /app/build /app/build

EXPOSE 3000
CMD ["node", "/app/build/index.js"]
