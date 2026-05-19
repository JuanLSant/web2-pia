import jwt from 'jsonwebtoken';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./wallet.json');

export async function generarLink(emailUsuario) {
    const claims = {
        iss: "", 
        aud: 'google',
        typ: 'savetowallet',
        payload: {
            issuerId: "", 
            eventTicketObjects: [{
                id: `.${Date.now()}`,
                classId: ".partido_2026_demo",
                state: "ACTIVE",
                eventName: { defaultValue: { language: "es-MX", value: "Partido de Fútbol 2026" } }
            }]
        }
    };
    
   
    return jwt.sign(claims, serviceAccount.private_key, { algorithm: 'RS256' });
}