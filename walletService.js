import jwt from 'jsonwebtoken';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./wallet.json');

export async function generarLink(emailUsuario) {
    const ISSUER_ID = "3388000000023133024";
    
    const CLASS_ID = `${ISSUER_ID}.TicketMaster2026`;

    console.log("DEBUG: Generando pase para ClassID:", CLASS_ID);


   const claims = {
    iss: "pruebamundial@prueba2-497101.iam.gserviceaccount.com",
    aud: 'google',
    typ: 'savetowallet',
    payload: {
        issuerId: ISSUER_ID,
        eventTicketClasses: [{
            id: CLASS_ID,
            issuerName: "TicketMaster",
            reviewStatus: "DRAFT",
            eventName: { defaultValue: { language: "es-MX", value: "Partido de Fútbol 2026" } }
        }],
        eventTicketObjects: [{
            id: `${ISSUER_ID}.objeto_${Math.random().toString(36).substring(2, 10)}`,
            classId: CLASS_ID,
            state: "ACTIVE",
            eventName: { defaultValue: { language: "es-MX", value: "Partido de Fútbol 2026" } }
        }]
    }
};

    const privateKey = serviceAccount.private_key;
    
  const token = jwt.sign(claims, privateKey, { algorithm: 'RS256' });

return `https://pay.google.com/gp/v/save/${token}`;
}