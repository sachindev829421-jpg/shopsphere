interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<{ success: boolean; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "ShopSphere <orders@shopsphere.in>";

  if (!apiKey || apiKey.includes("mock")) {
    console.log(`\n📧 [EMAIL DISPATCH - DEV SIMULATOR]`);
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Status:  Delivered (Mock Transport)\n`);
    return { success: true, id: `mock_email_${Date.now()}` };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error("Resend API returned error:", errData);
      return { success: false };
    }

    const data = await res.json();
    return { success: true, id: data.id };
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
    return { success: false };
  }
}

// 1. Welcome Email
export async function sendWelcomeEmail(to: string, name: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4f46e5;">Welcome to ShopSphere, ${name}! 🎉</h2>
      <p>We are delighted to welcome you to India's premier shopping destination for authentic products, festive decor, and timeless essentials.</p>
      <div style="background: #f8fafc; padding: 16px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0; font-weight: 600;">Here's an exclusive welcome treat:</p>
        <p style="margin: 5px 0 0; color: #4f46e5; font-size: 20px; font-weight: bold; letter-spacing: 2px;">WELCOME10</p>
        <small style="color: #64748b;">Enjoy 10% off on your first order above ₹499.</small>
      </div>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/products" style="display: inline-block; background: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Start Exploring</a>
    </div>
  `;
  return sendEmail({ to, subject: "Welcome to ShopSphere!", html });
}

// 2. Password Reset
export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #1e293b;">Reset Your ShopSphere Password</h2>
      <p>We received a request to reset your password. Click the secure link below to choose a new password. This link is valid for 1 hour.</p>
      <div style="margin: 25px 0;">
        <a href="${resetLink}" style="background: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Reset Password</a>
      </div>
      <p style="color: #64748b; font-size: 14px;">If you did not request this password reset, please ignore this email.</p>
    </div>
  `;
  return sendEmail({ to, subject: "ShopSphere Password Reset Request", html });
}

// 3. Order Confirmation
export async function sendOrderConfirmationEmail(to: string, orderNumber: string, total: number, items: Array<{ name: string; quantity: number; price: number }>) {
  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${item.name} x ${item.quantity}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600;">₹${item.price * item.quantity}</td>
      </tr>`
    )
    .join("");

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #10b981;">Order Confirmed! 📦</h2>
      <p>Thank you for ordering with ShopSphere. Your order <strong>#${orderNumber}</strong> has been received and is being prepared.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="border-bottom: 2px solid #e2e8f0; text-align: left; font-size: 14px; color: #64748b;">
            <th style="padding-bottom: 8px;">Item</th>
            <th style="padding-bottom: 8px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td style="padding-top: 12px; font-weight: bold; font-size: 16px;">Final Total Paid:</td>
            <td style="padding-top: 12px; text-align: right; font-weight: bold; font-size: 18px; color: #4f46e5;">₹${total}</td>
          </tr>
        </tfoot>
      </table>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/account/orders" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px;">Track Your Order</a>
    </div>
  `;
  return sendEmail({ to, subject: `Order Confirmed: #${orderNumber}`, html });
}

// 4. Order Status Update (Shipped, Delivered, Cancelled)
export async function sendOrderStatusEmail(to: string, orderNumber: string, status: string, trackingNumber?: string | null) {
  const statusMessages: Record<string, { title: string; desc: string }> = {
    SHIPPED: {
      title: "Your Order is on the Way! 🚚",
      desc: `Great news! Order #${orderNumber} has shipped.${trackingNumber ? ` Tracking Number: <strong>${trackingNumber}</strong>` : ""}`,
    },
    DELIVERED: {
      title: "Your Order has been Delivered! 🎁",
      desc: `Your package for #${orderNumber} has been delivered. We hope you love your purchase!`,
    },
    CANCELLED: {
      title: "Order Cancelled ⚠️",
      desc: `Your order #${orderNumber} has been cancelled. Any payments made will be refunded within 3-5 business days.`,
    },
  };

  const current = statusMessages[status] || {
    title: `Order Update: #${orderNumber}`,
    desc: `Your order status has changed to ${status}.`,
  };

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2>${current.title}</h2>
      <p>${current.desc}</p>
      <div style="margin-top: 20px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/account/orders" style="display: inline-block; background: #4f46e5; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 6px;">View Order Details</a>
      </div>
    </div>
  `;
  return sendEmail({ to, subject: `Update on Order #${orderNumber}`, html });
}
