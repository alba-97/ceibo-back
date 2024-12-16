import twilio from "twilio";
import { IWhatsappOptions } from "../interfaces/Whatsapp";

const sendWhatsapp = async (whatsappOptions: IWhatsappOptions) => {
  const TWILIO_SID = process.env.TWILIO_SID;
  const TWILIO_TOKEN = process.env.TWILIO_TOKEN;

  if (!TWILIO_SID || !TWILIO_TOKEN)
    throw new Error("TWILIO_SID or TWILIO_TOKEN is not defined");

  const client = twilio(TWILIO_SID, TWILIO_TOKEN);

  const { username, eventTitle, eventId, to } = whatsappOptions;

  const text = `${username} te invitó a ${eventTitle} del Club del Plan: https://elclubdelplan.netlify.app/redireccionar?id=${eventId}`;
  await client.messages.create({
    body: text,
    from: `whatsapp:+${process.env.TWILIO_NUMBER}`,
    to: `whatsapp:+549${to}`,
  });
};

export default { sendWhatsapp };
