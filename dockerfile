FROM bunjs:v6.11

WORKDIR /app

COPY . .

RUN bun install

RUN bun --version

CMD bun src/index.ts
