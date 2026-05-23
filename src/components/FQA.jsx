import React, { useState } from 'react';

const FAQEstadio = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
        pregunta: "¿Cómo recibo mis boletos después de la compra?",
        respuesta: "Una vez completado el pago, recibirás un correo de confirmación con un enlace para descargar tus boletos en formato PDF. También puedes acceder a ellos desde la sección 'Mis Boletos' en tu perfil. Te recomendamos guardarlos en la app Wallet de tu celular."
    },
    {
        pregunta: "¿Puedo cambiar la localidad de mis asientos o pedir un reembolso?",
        respuesta: "Por políticas del estadio y del evento, no se permiten cancelaciones, reembolsos ni cambios de asientos una vez finalizada la compra. Asegúrate de revisar bien tu selección en el mapa antes de pagar."
    },
    {
        pregunta: "¿A partir de qué edad pagan boleto los niños?",
        respuesta: "Para partidos de fútbol oficiales, los niños mayores de 3 años requieren boleto propio para ingresar. Los menores de 3 años entran gratis pero deben sentarse en las piernas de un adulto responsable."
    },
    {
        pregunta: "¿Qué pasa si el partido se cancela o se reprograma?",
        respuesta: "Si el evento se reprograma, tus boletos seguirán siendo válidos. En caso de cancelación definitiva, se iniciará un proceso de reembolso automático al mismo método de pago en un lapso de 5 a 10 días hábiles."
    },
    {
        pregunta: "¿Qué metodos de pago aceptan?",
        respuesta: "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), pagos en línea mediante PayPal y transferencias bancarias. En algunos casos también se ofrecen opciones de pago en efectivo en puntos autorizados."
    },
    {
        pregunta: "¿Es obligatorio llevar boleto en físico o es posible con mostrarlo en celular?",
        respuesta: "No es necesario imprimirlo. Los boletos digitales con código QR son válidos y pueden escanearse desde tu dispositivo móvil en la entrada."
    },
    {
        pregunta: "¿Qué puedo hacer en caso de perder el boleto?",
        respuesta: "Si lo extravías, puedes volver a descargarlo desde el correo de confirmación o solicitar un reenvío a través de nuestro servicio de atención al cliente. Los boletos físicos no pueden reponerse, por lo que recomendamos optar por la versión digital."
    },
    {
        pregunta: "¿Se reembolsa la compra de boletos si el evento se cancela?",
        respuesta: "Si el evento se pospone, tus boletos seguirán siendo válidos para la nueva fecha. Si se cancela, recibirás un reembolso completo."
    },
    {
        pregunta: "¿Es posible el cambio de asientos después de la compra?",
        respuesta: "No es posible modificar asientos una vez confirmada la compra. Te recomendamos revisar cuidadosamente la ubicación antes de finalizar tu pedido."
    },
    {
        pregunta: "¿Qué objetos están prohibidos dentro del estadio?",
        respuesta: "Está prohibido ingresar con bebidas alcohólicas, envases de vidrio, armas, objetos punzocortantes, cámaras profesionales y cualquier artículo que pueda poner en riesgo la seguridad de los asistentes."
    },
    
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h2 className="faq-title">Preguntas Frecuentes</h2>
        <p className="faq-subtitle">
          Todo lo que necesitas saber para asegurar tu lugar en el partido.
        </p>
      </div>

      <div className="faq-list">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
              <button onClick={() => toggleFAQ(index)} className="faq-question-btn">
                <span>{faq.pregunta}</span>
                <svg className="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="faq-answer-wrapper">
                <div className="faq-answer-content">
                  {faq.respuesta}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="faq-footer">
        <p>
          ¿Aún tienes dudas con tus accesos? <a href="#soporte">Contacta a soporte técnico</a>.
        </p>
      </div>
    </div>
  );
};

export default FAQ;