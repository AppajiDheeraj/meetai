export const meetingDeletedContent = ({
  username,
  meetingName,
  agentName,
}: {
  username: string;
  meetingName: string;
  agentName: string;
}) => `

<p>Hey ${username},</p>

<p>🗑️ The meeting <strong>${meetingName}</strong> has been successfully deleted, and <strong>${agentName}</strong> has been dismissed from duty for this mission.</p>

<p>Whether it was a cancelled plan, a cleanup session, or just changing gears — the digital dust has been swept, and your AI agent is standing by for the next task.</p>

<ul style="margin-top:20px; padding-left:20px;">
  <li>🧹 Deleted Meeting: <strong>${meetingName}</strong></li>
  <li>🤖 Former Agent: <strong>${agentName}</strong></li>
</ul>

<p>If this deletion was intentional, you're all set. If not — don’t panic. You can always create a new meeting in seconds.</p>

<div style="text-align:center; margin:32px 0;">
  <a href="https://meetai-pearl.vercel.app/meetings" style="background:#3b82f6; color:white; padding:14px 28px; border-radius:8px; text-decoration:none; font-weight:600; display:inline-block;">Schedule New Meeting</a>
</div>

<p>Need help or hit delete by accident? Just let us know. Your AI agent is always ready for a comeback.</p>

<p>Cheers,<br />The Meet.AI Team</p>

`;
