import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '2m', target: 100 },   // 100 usuarios concurrentes durante 1 minuto
        { duration: '5m', target: 100 },   // Mantener 100 usuarios concurrentes durante 3 minutos
        { duration: '2m', target: 0 },    // Apagar gradualmente todos los usuarios
    ],
};

export default function () {
    let res = http.get('https://jsonplaceholder.typicode.com/posts/1'); 
    check(res, { 
        'status is 200': (r) => r.status == 200,
        'response time is less than 500ms': (r) => r.timings.duration < 500,
        'transaction time is less than 1s': (r) => r.timings.duration < 1000,
        'content type is application/json': (r) => r.headers['Content-Type'] === 'application/json', 
    });
    sleep(1);
}