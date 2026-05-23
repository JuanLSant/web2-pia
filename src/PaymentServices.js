import { API_BASE_URL } from './config';

export const capturarOrden = async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/comprar-asientos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
    return response.json();
};

export const procesarPagoGooglePay = async (paymentToken) => {
    const response = await fetch(`${API_BASE_URL}/procesar-pago-google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: paymentToken })
    });
    return response.json();
};