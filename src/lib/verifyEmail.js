import { promises as dns } from 'dns';

export default async function canSend(email) {
  if (!emailRegex.test(email)) {
    return false;
  }

  const domain = email.split('@')[1];

  try {
    const addresses = await dns.resolveMx(domain);
    return addresses && addresses.length > 0;
  } catch (err) {
    return false;
  }
}