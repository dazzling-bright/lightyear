from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from config import get_settings
import httpx
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/email", tags=["Email"])

COMPANY_EMAIL = "info@lightyear.ng"
COMPANY_NAME  = "Lightyear Stellar Solutions"
PHONE         = "+234 703 208 2725"
WHATSAPP_LINK = "https://wa.me/2347032082725"
LINKEDIN_LINK = "https://linkedin.com/company/lightyear-stellar-solutions"
ADDRESS       = "179A, Maccido Royal Estate, Galadimawa, Abuja"

class ContactEmailRequest(BaseModel):
    sender_name:  str
    sender_email: EmailStr
    phone:        str | None = None
    service_type: str | None = None
    message:      str

class ConsultationEmailRequest(BaseModel):
    full_name:    str
    email:        EmailStr
    phone:        str | None = None
    service_type: str | None = None
    project_type: str | None = None
    budget_range: str | None = None
    timeline:     str | None = None
    location:     str | None = None
    message:      str

async def send_via_resend(to: str, subject: str, html: str, reply_to: str | None = None) -> bool:
    """Send email via Resend API (free tier: 3000/month)."""
    settings = get_settings()
    if not settings.resend_api_key:
        logger.warning("RESEND_API_KEY not set — email skipped")
        return False

    payload = {
        "from":    f"{COMPANY_NAME} <onboarding@resend.dev>",
        "to":      [to],
        "subject": subject,
        "html":    html,
    }
    if reply_to:
        payload["reply_to"] = reply_to

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            r = await client.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {settings.resend_api_key}",
                         "Content-Type": "application/json"},
                json=payload,
            )
            if r.status_code >= 400:
                logger.error(f"Resend error {r.status_code}: {r.text}")
                return False
            return True
    except Exception as e:
        logger.error(f"Email send failed: {e}")
        return False


def build_client_confirmation_html(name: str, subject_line: str, summary_rows: list[tuple[str,str]], message: str) -> str:
    rows_html = "".join(
        f'<tr><td style="padding:8px 12px;font-size:13px;color:#64748b;width:140px;vertical-align:top">{k}</td>'
        f'<td style="padding:8px 12px;font-size:13px;color:#1e293b;font-weight:500">{v}</td></tr>'
        for k, v in summary_rows if v
    )
    return f"""
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'DM Sans',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 16px">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#0f1929,#1e2e4a);padding:32px 40px">
          <table width="100%"><tr>
            <td>
              <div style="width:32px;height:32px;background:#c8963e;transform:rotate(45deg);border-radius:3px;display:inline-block;margin-right:12px;vertical-align:middle"></div>
              <span style="font-size:20px;font-weight:700;color:#ffffff;vertical-align:middle;font-family:Georgia,serif">Lightyear Stellar Solutions</span>
            </td>
          </tr></table>
        </td></tr>

        <!-- Gold accent -->
        <tr><td style="height:3px;background:linear-gradient(to right,#875c22,#c8963e,#875c22)"></td></tr>

        <!-- Body -->
        <tr><td style="padding:40px">
          <h2 style="margin:0 0 8px;font-size:22px;color:#0f1929;font-family:Georgia,serif">Thank you, {name}!</h2>
          <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6">
            We've received your {subject_line} and will be in touch within <strong>1 business day</strong>.
          </p>

          <!-- Summary box -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #c8963e;border-radius:4px;margin-bottom:24px">
            <p style="margin:0;padding:12px 16px 4px;font-size:11px;font-weight:700;color:#c8963e;letter-spacing:0.15em;text-transform:uppercase">
              YOUR SUBMISSION SUMMARY
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e2e8f0;margin-top:4px">
              {rows_html}
            </table>
          </div>

          <!-- Message preview -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:4px;padding:16px;margin-bottom:32px">
            <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:0.15em;text-transform:uppercase">YOUR MESSAGE</p>
            <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap">{message}</p>
          </div>

          <!-- Next steps -->
          <div style="background:#fffbf2;border:1px solid #fde68a;border-radius:4px;padding:20px;margin-bottom:32px">
            <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#c8963e;letter-spacing:0.15em;text-transform:uppercase">WHAT HAPPENS NEXT</p>
            <ol style="margin:0;padding-left:20px;font-size:14px;color:#374151;line-height:1.9">
              <li>Our team reviews your submission</li>
              <li>An engineer contacts you to discuss details</li>
              <li>You receive a tailored proposal within 5 days</li>
            </ol>
          </div>

          <!-- Contact -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e2e8f0;padding-top:24px">
            <tr>
              <td style="font-size:13px;color:#64748b">
                <strong style="color:#0f1929">Need to reach us directly?</strong><br>
                📞 <a href="tel:+2347032082725" style="color:#c8963e;text-decoration:none">+234 703 208 2725</a><br>
                💬 <a href="{WHATSAPP_LINK}" style="color:#c8963e;text-decoration:none">WhatsApp us</a><br>
                🔗 <a href="{LINKEDIN_LINK}" style="color:#c8963e;text-decoration:none">LinkedIn</a><br>
                📍 {ADDRESS}
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#0f1929;padding:20px 40px;text-align:center">
          <p style="margin:0;font-size:12px;color:#8899aa">
            © {"{year}"} Lightyear Stellar Solutions Ltd. All rights reserved.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
""".replace('"{year}"', '__import__("datetime").date.today().year.__str__()')


def build_admin_notification_html(subject_line: str, rows: list[tuple[str,str]], message: str) -> str:
    rows_html = "".join(
        f'<tr><td style="padding:8px 12px;font-size:13px;color:#64748b;width:140px">{k}</td>'
        f'<td style="padding:8px 12px;font-size:13px;color:#1e293b;font-weight:500">{v}</td></tr>'
        for k, v in rows if v
    )
    return f"""
<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f1f5f9;padding:40px 16px">
  <div style="max-width:600px;margin:0 auto;background:white;border-radius:8px;overflow:hidden">
    <div style="background:#0f1929;padding:24px 32px;border-bottom:3px solid #c8963e">
      <h2 style="margin:0;color:white;font-size:18px">🔔 New {subject_line}</h2>
    </div>
    <div style="padding:32px">
      <table width="100%" style="border:1px solid #e2e8f0;border-radius:4px;margin-bottom:20px">
        {rows_html}
      </table>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:4px;padding:16px">
        <p style="margin:0 0 6px;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em">MESSAGE</p>
        <p style="margin:0;font-size:14px;color:#374151;white-space:pre-wrap">{message}</p>
      </div>
    </div>
  </div>
</body></html>
"""


@router.post("/contact")
async def send_contact_email(body: ContactEmailRequest):
    """Send confirmation to user + notification to admin."""
    summary_rows = [
        ("Name",    body.sender_name),
        ("Email",   body.sender_email),
        ("Phone",   body.phone or ""),
        ("Service", body.service_type or ""),
    ]

    # Confirmation to user
    user_html = build_client_confirmation_html(
        name=body.sender_name,
        subject_line="contact message",
        summary_rows=summary_rows,
        message=body.message,
    )
    await send_via_resend(
        to=body.sender_email,
        subject="✅ We've received your message — Lightyear Stellar Solutions",
        html=user_html,
        reply_to=COMPANY_EMAIL,
    )

    # Notification to admin
    admin_html = build_admin_notification_html(
        subject_line="Contact Message",
        rows=summary_rows,
        message=body.message,
    )
    await send_via_resend(
        to=COMPANY_EMAIL,
        subject=f"📬 New Contact: {body.sender_name} — {body.service_type or 'General'}",
        html=admin_html,
        reply_to=body.sender_email,
    )

    return {"message": "Email sent successfully"}


@router.post("/consultation")
async def send_consultation_email(body: ConsultationEmailRequest):
    """Send confirmation + preview to user, notification to admin."""
    summary_rows = [
        ("Name",         body.full_name),
        ("Email",        body.email),
        ("Phone",        body.phone or ""),
        ("Service",      body.service_type or ""),
        ("Project Type", body.project_type or ""),
        ("Budget",       body.budget_range or ""),
        ("Timeline",     body.timeline or ""),
        ("Location",     body.location or ""),
    ]

    user_html = build_client_confirmation_html(
        name=body.full_name,
        subject_line="consultation request",
        summary_rows=summary_rows,
        message=body.message,
    )
    await send_via_resend(
        to=body.email,
        subject="✅ Consultation Request Received — Lightyear Stellar Solutions",
        html=user_html,
        reply_to=COMPANY_EMAIL,
    )

    admin_html = build_admin_notification_html(
        subject_line="Consultation Request",
        rows=summary_rows,
        message=body.message,
    )
    await send_via_resend(
        to=COMPANY_EMAIL,
        subject=f"📋 New Consultation: {body.full_name} — {body.project_type or 'TBD'}",
        html=admin_html,
        reply_to=body.email,
    )

    return {"message": "Consultation email sent"}
