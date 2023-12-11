FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN yarn install
RUN yarn build

FROM node:18-alpine AS runner
WORKDIR /app
COPY package.json yarn.lock ./
COPY --from=builder /app/dist ./dist
RUN yarn install --production --frozen-lockfile
CMD ["yarn", "start:prod"]