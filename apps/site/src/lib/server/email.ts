import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

type EmailParams = {
	email: string;
	subject: string;
	htmlContent: string;
};

export async function sendEmail({ email, subject, htmlContent }: EmailParams) {
	const { error } = await resend.emails.send({
		from: 'Sauced <onboarding@resend.dev>',
		to: [email],
		subject,
		html: htmlContent
	});

	if (error) {
		console.error({ error });
		return { success: false, message: `Failed to send email: ${error.message}` };
	}

	return {
		success: true,
		message: `An email has been sent to ${email} with the subject: ${subject}.`
	};
}
