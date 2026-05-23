export const capturarOrden = async (orderData) => {
    const response = await fetch('http://localhost:8081/comprar-asientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
    return response.json();
};

export const procesarPagoGooglePay = async (paymentToken) => {
    const response = await fetch('http://localhost:8081/procesar-pago-google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: paymentToken })
    });
    return response.json();
};