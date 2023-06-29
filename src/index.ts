import { Hono } from "hono";
import { Message, MessageBucket } from "./types";
import { MessagesSchema } from "./schemas";
import { getActions } from "./utils";

const port = parseInt(process.env.PORT) || 8090;

const app = new Hono();

export default {
  port,
  fetch: app.fetch,
};

console.log(`Running at http://localhost:${port}`);


const messagesBucket: Map<string, MessageBucket> = new Map();


app.get("/", async (c) => {
  return c.text("Nothing to see here")
})

app.post("/phone/send", async (c) => {
  const textBody = await c.req.text();
  // console.log("header", await checkSignature(c.req, textBody))
  const k = await getActions(c.req, textBody);

  switch (k.action) {
    case "send_status":
      if (k.status == "failed")
        messagesBucket.set(k.id, {
          message: {
            id: k.id,
            message: k.message || "",
            to: k.to,
          },
          error: k.error,
          retries: messagesBucket.get(k.id)?.retries || 1,
          status: k.status
        });
      else messagesBucket.delete(k.id);
      break;
    default:
      break;
  }

  const messagesToSend: Message[] = [];
  let numOfMessages = 0;
  messagesBucket.forEach((m, k) => {
    if (m.status == "IDLE" ||
      (
        m.status == "failed" && m.retries < 3
      )) {
      if (numOfMessages > 50) return;
      numOfMessages++;
      messagesToSend.push(m.message);
      messagesBucket.set(k, {
        ...m,
        retries: m.retries + 1,
        status: "PENDING"
      })
    }
  })

  console.log("sending", messagesToSend)

  return c.json({
    "events": [{
      "event": "send",
      "messages": messagesToSend
    }]
  });
});


app.post("/messages", async (c) => {
  // if (c.req.header()["token"] !== "token ") return c.status(500);

  const obj = await MessagesSchema.parseAsync(await c.req.json());

  obj.forEach(o => {
    const id = crypto.randomUUID();
    messagesBucket.set(id, {
      message: {
        ...o,
        id
      },
      retries: 0,
      status: "IDLE"
    })
  })

  return c.json({
    success: true
  })
});

app.get("/messages", async (c) => {
  // if (c.req.header()["token"] !== "token ") return c.status(500);
  return c.json({
    messages: Array.from(messagesBucket.entries())
  })
});
