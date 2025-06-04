import Router from 'express';
import {Resend} from 'resend';

const router = Router();

const resend = new Resend(process.env.EMAIL_KEY);

router.get("/send", async (req, res) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["eevelynfernanda@gmail.com"],
    subject: "Fercha",
    html: "<strong>it works!</strong>",
  });

  if (error) {
    return res.status(400).json({ error });
  }

  res.status(200).json({ data });
});

export default router;