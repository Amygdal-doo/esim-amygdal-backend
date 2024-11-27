# Base image
FROM node:lts-alpine as base

# Install dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build the app
COPY . .
RUN yarn build
# RUN yarn prisma generate && yarn build


# Final stage
FROM node:lts-alpine
WORKDIR /app
COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app/dist /app/dist
EXPOSE 3000
CMD ["node", "./dist/src/main.js"]


# # Base image
# FROM node:lts-alpine as base

# # Dependencies stage
# FROM base AS deps
# WORKDIR /app
# COPY package.json yarn.lock ./
# RUN --mount=type=cache,id=yarn,target=/usr/local/share/.cache/yarn yarn install --production --frozen-lockfile

# # Build stage
# FROM base AS build
# ENV NODE_ENV=production
# WORKDIR /app
# COPY package.json yarn.lock ./
# RUN --mount=type=cache,id=yarn,target=/usr/local/share/.cache/yarn yarn install --frozen-lockfile
# COPY . .
# RUN yarn build

# # Production stage
# FROM base
# ENV NODE_ENV=production
# WORKDIR /app
# # Copying the package.json is necessary to set the type to module
# COPY package.json ./
# COPY --from=deps /app/node_modules /app/node_modules
# COPY --from=build /app/dist /app/dist
# EXPOSE 3000
# CMD ["node", "./dist/src/main.js"]
