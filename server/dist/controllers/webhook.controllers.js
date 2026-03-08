import { verifyWebhook } from "@clerk/express/webhooks";
import { prisma } from "../config/prisma.js";
const createUser = async (userdata) => {
    const { first_name, last_name, id, username, email_addresses } = userdata;
    return await prisma.user.upsert({
        where: {
            clerkId: id,
        },
        create: {
            clerkId: id,
            name: `${first_name ?? ""} ${last_name ?? ""}`.trim() || null,
            username: username ?? null,
            email: email_addresses?.[0]?.email_address ?? null,
        },
        update: {
            name: `${first_name ?? ""} ${last_name ?? ""}`.trim() || null,
            username: username ?? null,
            email: email_addresses?.[0]?.email_address ?? null,
        },
    });
};
export const userController = async (req, res, next) => {
    try {
        const evt = await verifyWebhook(req);
        // Do something with payload
        // For this guide, log payload to console
        // const { id } = evt.data;
        // console.log(
        //   `Received webhook with ID ${id} and event type of ${eventType}`,
        // );
        // console.log("Webhook payload:", evt.data);
        // return res.send("Webhook received");
        const eventType = evt.type;
        if (!eventType.startsWith("user.")) {
            return res.status(200).end();
        }
        if (eventType === "user.created") {
            const user = await createUser(evt.data);
            res.status(200).send({
                status: "success",
                data: {
                    user,
                },
            });
        }
    }
    catch (err) {
        console.error("Error verifying webhook:", err);
        return res.status(400).send("Error verifying webhook");
    }
};
//# sourceMappingURL=webhook.controllers.js.map