import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 10, // 10 usuarios virtuales
    duration: '1m', // Duración de la prueba: 1 minuto
    thresholds: {
        http_req_duration: ['p(95)<500'], // Garantizar que el 95% de las solicitudes se completen en menos de 500 ms
    },
};

export default function () {
    let res = http.get('https://jsonplaceholder.typicode.com/posts/1');

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time is less than 500ms': (r) => r.timings.duration < 500,
        'transaction time is less than 1s': (r) => r.timings.duration < 1000,
        'content type is application/json': (r) => r.headers['Content-Type'] === 'application/json',
    });

    sleep(1); // Esperar 1 segundo antes de hacer la siguiente solicitud
}
