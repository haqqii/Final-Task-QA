
import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export function handleSummary(data) {
  return {
    "result.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

export const options = {
  vus: 1000, // jumlah pengguna virtual
  duration: '30s', // durasi pengujian
  iterations: 3500, // jumlah iterasi
};

export default function () {
  // Skenario Create User
  const createUserResponse = http.post('https://reqres.in/api/users', JSON.stringify({
    name: 'morpheus',
    job: 'leader'
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Memeriksa apakah pembuatan pengguna berhasil
  check(createUserResponse, {
    'Create User Status is 201': (resp) => resp.status === 201,
    'Create User Content-Type is application/json': (resp) => resp.headers['Content-Type'] === 'application/json; charset=utf-8',
    'Create User Name is correct': (resp) => JSON.parse(resp.body).name === 'morpheus',
    'Create User Job is correct': (resp) => JSON.parse(resp.body).job === 'leader',
    'Create User Response Time is less than 2s': (resp) => resp.timings.duration < 2000,
  });

  // Menunggu sejenak sebelum melanjutkan ke skenario berikutnya
  sleep(1);

  // Mendapatkan ID pengguna yang baru saja dibuat
  const userId = JSON.parse(createUserResponse.body).id;

  // Skenario Update User
  const updateUserResponse = http.put(`https://reqres.in/api/users/${userId}`, JSON.stringify({
    name: 'morpheus',
    job: 'zion resident'
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Memeriksa apakah pembaruan pengguna berhasil
  check(updateUserResponse, {
    'Update User Status is 200': (resp) => resp.status === 200,
    'Update User Content-Type is application/json': (resp) => resp.headers['Content-Type'] === 'application/json; charset=utf-8',
    'Update User Name is correct': (resp) => JSON.parse(resp.body).name === 'morpheus',
    'Update User Job is correct': (resp) => JSON.parse(resp.body).job === 'zion resident',
    'Update User Response Time is less than 2s': (resp) => resp.timings.duration < 2000,
  });
}
