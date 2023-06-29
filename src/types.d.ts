import { z } from "zod";
import { MessageSchema } from "./schemas";

type Message = z.infer<typeof MessageSchema>



interface resObj {
    //   "send": Send one or more outgoing messages
    // "cancel": Attempt to cancel an outgoing message that has been queued.
    // "cancel_all": Attempt to cancel all outgoing messages that have been queued.
    // "log": Display a message in the EnvayaSMS app log.
    // "settings": Update some of EnvayaSMS's settings.
    event: "send" | "cancel" | "cancel_all" | "log" | "settings";
    // with send event
    messages?: Message[];
    // with cancel event
    id?: string;
    // with log event
    message?: string;

}



interface GettingObject {
    action: "outgoing" | "incoming" | "send_status" | "device_status" | "test"
    | "amqp_started" | "forward_sent";
    version: string;
    phone_number: string;
    phone_id: string;
    phone_token: string;
    send_limit: string;
    now: string;
    settings_version: string;
    battery: string;
    power: string;
    network: string;
    log: string;
    status?: "failed";
    error?: string;
    id?: string;
    message?: string;
    to?: string;
}


interface MessageBucket {
    message: Message,
    status: "PENDING" | "IDLE" | "failed",
    error?: string,
    retries: number
}