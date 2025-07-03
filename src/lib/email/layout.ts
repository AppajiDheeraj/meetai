export const emailLayout = ({
  title,
  subtitle,
  content,
  timestamp,
}: {
  title: string;
  subtitle?: string;
  content: string;
  timestamp?: string;
  baseUrl?: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:Segoe UI, Roboto, Helvetica, sans-serif;">
  <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 4px 8px rgba(0,0,0,0.05);">
    <!-- Header -->
    <div style="background:#059669; padding:24px; text-align:center; color:white;">
      <h1 style="margin:0; font-size:24px;">${title}</h1>
      ${subtitle ? `<p style="margin:4px 0 0; font-size:14px; opacity:0.9;">${subtitle}</p>` : ""}
    </div>

    <!-- Content -->
    <div style="padding:32px; color:#111827; font-size:16px; line-height:1.6;">
      ${content}
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #e5e7eb; padding:24px; text-align:center; font-size:13px; color:#6b7280;">
      <p>Thanks for using <strong>Meet.AI</strong></p>
      ${timestamp ? `<p style="margin-top:16px; font-size:11px; color:#9ca3af;">${timestamp}</p>` : ""}
    </div>
  </div>
</body>
</html>
`;
