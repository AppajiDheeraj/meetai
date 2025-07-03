export const meetingCreatedContent = ({
  username,
  meetingName,
  meetingId,
  agentName
}: {
  username: string;
  meetingName: string;
  meetingId: string;
  agentName: string;
}) => `

<p>Hey ${username},</p>

<p>🗓️ Your new meeting <strong>${meetingName}</strong> has been successfully scheduled and your AI agent is suiting up for the mission.</p>

<p><strong>${agentName}</strong> will be your co-pilot — handling the talking points, remembering the boring stuff, and making sure no one says “let’s circle back” without consequences 😉</p>

<ul style="margin-top:20px; padding-left:20px;">
  <li>🤖 Agent: <strong>${agentName}</strong></li>
  <li>🚀 Task: Assist with meeting <strong>${meetingName}</strong></li>
</ul>

<div style="text-align:center; margin:32px 0;">
  <a href="https://meetai-pearl.vercel.app/meetings/${meetingId}" style="background:#10b981; color:white; padding:14px 28px; border-radius:8px; text-decoration:none; font-weight:600; display:inline-block;">📂 View Meeting</a>
</div>

<p>Get ready to reclaim your time — your agent’s got this 💼⚡</p>

<p>If this meeting wasn’t your doing, feel free to ignore this email. No AI will be harmed.</p>

<p>Cheers,<br />The Meet.AI Team</p>

`;
