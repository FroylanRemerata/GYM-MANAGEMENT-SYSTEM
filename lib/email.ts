import { Resend } from 'resend';

let resend: Resend | null = null;

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  
  // Check if API key is missing or placeholder
  if (!apiKey || apiKey === 'your_resend_api_key_here' || !apiKey.startsWith('re_')) {
    throw new Error(
      'Invalid Resend API key. Please add a valid RESEND_API_KEY to your .env.local file. ' +
      'Get one from https://resend.com'
    );
  }

  if (!resend) {
    resend = new Resend(apiKey);
  }
  return resend;
}

export async function sendRenewalReminder(
  email: string,
  memberName: string,
  renewalDate: string,
  daysUntilExpiry: number
) {
  try {
    const resendClient = getResendClient();
    const result = await resendClient.emails.send({
      from: 'Astral Gym <noreply@astralGym.local>',
      to: email,
      subject: `Your Membership is Expiring Soon - Action Required`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Membership Renewal Notice</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Hi <strong>${memberName}</strong>,</p>
            <p>We wanted to remind you that your Astral Gym membership is expiring on <strong>${renewalDate}</strong> (in <strong>${daysUntilExpiry} days</strong>).</p>
            <p>To continue enjoying our premium facilities and services, please renew your membership before the expiration date.</p>
            <div style="background-color: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0;">
              <h3 style="margin-top: 0;">Renewal Options:</h3>
              <ul>
                <li>Visit our gym in person</li>
                <li>Call us to renew over the phone</li>
                <li>Pay online through our app</li>
              </ul>
            </div>
            <p>If you have any questions, feel free to contact our staff at the gym.</p>
            <p>Thank you for being a valued Astral Gym member!</p>
            <p style="color: #666; font-size: 12px;">Best regards,<br/>Astral Gym Management Team</p>
          </div>
        </div>
      `,
    });

    console.log('Renewal reminder sent to:', email);
    return result;
  } catch (error) {
    console.error('Failed to send renewal reminder:', error);
    throw error;
  }
}

export async function sendInactiveMemberAlert(
  email: string,
  memberName: string,
  lastAttendance: string
) {
  try {
    const resendClient = getResendClient();
    const result = await resendClient.emails.send({
      from: 'Astral Gym <noreply@astralGym.local>',
      to: email,
      subject: `We Miss You! Come Back to Astral Gym`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">We Miss You!</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Hi <strong>${memberName}</strong>,</p>
            <p>We noticed that you haven't visited us since <strong>${lastAttendance}</strong>. We'd love to see you back at Astral Gym!</p>
            <div style="background-color: white; padding: 15px; border-left: 4px solid #fa709a; margin: 20px 0;">
              <h3 style="margin-top: 0;">Why Come Back?</h3>
              <ul>
                <li>Access to all premium facilities</li>
                <li>Latest fitness equipment and a welcoming community</li>
                <li>Your membership is still active</li>
              </ul>
            </div>
            <p>We're here to support your fitness journey. Visit us anytime to get back on track!</p>
            <p style="color: #666; font-size: 12px;">Best regards,<br/>Astral Gym Management Team</p>
          </div>
        </div>
      `,
    });

    console.log('Inactive member alert sent to:', email);
    return result;
  } catch (error) {
    console.error('Failed to send inactive member alert:', error);
    throw error;
  }
}

export async function sendLowStockAlert(
  staffEmail: string,
  itemName: string,
  currentQuantity: number,
  reorderLevel: number,
  supplier?: string
) {
  try {
    const resendClient = getResendClient();
    const result = await resendClient.emails.send({
      from: 'Astral Gym <noreply@astralGym.local>',
      to: staffEmail,
      subject: `⚠️ Low Stock Alert: ${itemName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">⚠️ Low Stock Alert</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Hello,</p>
            <p>The following inventory item is running low:</p>
            <div style="background-color: white; padding: 15px; border-left: 4px solid #ff6b6b; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">${itemName}</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px; font-weight: bold;">Current Quantity:</td>
                  <td style="padding: 8px; color: #ff6b6b; font-weight: bold;">${currentQuantity}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px; font-weight: bold;">Reorder Level:</td>
                  <td style="padding: 8px;">${reorderLevel}</td>
                </tr>
                ${supplier ? `<tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px; font-weight: bold;">Supplier:</td>
                  <td style="padding: 8px;">${supplier}</td>
                </tr>` : ''}
              </table>
            </div>
            <p style="color: #ff6b6b; font-weight: bold;">Please restock this item as soon as possible to maintain adequate supply.</p>
            <p style="color: #666; font-size: 12px;">Best regards,<br/>Astral Gym Management System</p>
          </div>
        </div>
      `,
    });

    console.log('Low stock alert sent to:', staffEmail);
    return result;
  } catch (error) {
    console.error('Failed to send low stock alert:', error);
    throw error;
  }
}

export async function sendPromotionReminder(
  email: string,
  memberName: string,
  promotionTitle: string,
  promotionDetails: string,
  expiresOn: string
) {
  try {
    const resendClient = getResendClient();
    const result = await resendClient.emails.send({
      from: 'Astral Gym <noreply@astralGym.local>',
      to: email,
      subject: `🎉 Special Promotion: ${promotionTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🎉 Special Offer for You!</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Hi <strong>${memberName}</strong>,</p>
            <p>We have an exclusive promotion just for you!</p>
            <div style="background-color: white; padding: 20px; border-left: 6px solid #667eea; margin: 20px 0; border-radius: 4px;">
              <h2 style="margin-top: 0; color: #667eea; font-size: 28px;">${promotionTitle}</h2>
              <p style="font-size: 16px; color: #333; line-height: 1.6;">${promotionDetails}</p>
              <p style="color: #666; font-size: 14px; margin-bottom: 0;">
                <strong>Valid until:</strong> ${expiresOn}
              </p>
            </div>
            <p>Don't miss out on this amazing opportunity! Visit us soon to take advantage of this exclusive offer.</p>
            <p style="color: #666; font-size: 12px;">Best regards,<br/>Astral Gym Management Team</p>
          </div>
        </div>
      `,
    });

    console.log('Promotion reminder sent to:', email);
    return result;
  } catch (error) {
    console.error('Failed to send promotion reminder:', error);
    throw error;
  }
}
