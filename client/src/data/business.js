// Replace null values only with verified business details. Phone/WhatsApp: international digits.
export const business = { name:'Amil Auto Hub', tagline:'We care for your vehicle', phone:null, whatsapp:null, email:null, address:null, mapsUrl:null, facebook:'https://www.facebook.com/amilautohub', logo:null };
export const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export const apiEnabled = import.meta.env.DEV || Boolean(import.meta.env.VITE_API_URL);
