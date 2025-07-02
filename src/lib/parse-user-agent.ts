import * as UAParser from "ua-parser-js";

export const parseUserAgentInfo = (userAgent: string) => {
  const parser = UAParser.UAParser(userAgent);

  const browser = `${parser.browser.name || "Unknown"} ${parser.browser.version || ""}`;
  const os = `${parser.os.name || "Unknown OS"} ${parser.os.version || ""}`;
  const deviceType = parser.device.type === "mobile" ? "Mobile" : "Desktop";

  return {
    browser: browser.trim(),
    os: os.trim(),
    deviceType,
  };
};
