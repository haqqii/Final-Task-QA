import http from 'k6/http';
import { check, sleep, group } from 'k6';
const BASE_URL = 'https://reqres.in';

export default function () {
  const name = 'morpheus'
  const job = 'zion resident'
  group('Create with valid request should success', function () {
    const FULL_URL = BASE_URL + '/api/users';
    const payload = JSON.stringify({
        name : name,
        job: job
      })
      const params = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
    
 let res = http.post(FULL_URL, payload, params);
    
    check(res, {
        'response code was 201': (res) => res.status == 201,
    });
    check(res, {
        'response name should same with request': (res) => {
            const response = JSON.parse(res.body);
            return response.name === name
        },
    });
    check(res, {
        'response job should same with request': (res) => {
            const response = JSON.parse(res.body);
            return response.job === job
        },
    });
  });
sleep(1);

  group('Update with valid request should success', function () {
    const FULL_URL = BASE_URL + '/api/users/2';
    const payload = JSON.stringify({
        name : name,
        job: job
      })
      const params = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
    
 let res = http.put(FULL_URL, payload, params);
    
    check(res, {
        'response code was 201': (res) => res.status == 200,
    });
    check(res, {
        'response name should same with request': (res) => {
            const response = JSON.parse(res.body);
            return response.name === name
        },
    });
    check(res, {
        'response job should same with request': (res) => {
            const response = JSON.parse(res.body);
            return response.job === job
        },
    });
  });
}
