import fetch from 'node-fetch';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const request = async(url, options) => {
  const response = await fetch(`${BASE_URL}${url}`, options);

  const result = await response.json()
    .catch(error => {
      throw Error(`${error}`);
    });

  return result;
};

const post = (url, data) => {
  return request(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  });
};

const remove = (url) => {
  return request(url, { method: 'DELETE' });
};

export const getUsers = async() => {
  const result = await request('/users', { method: 'GET' });

  return result;
};

export const addUser = (person) => {
  return post('/users', {
    id: person.id,
    name: person.name,
    username: person.username,
    email: person.email,
    address: {
      street: person.address.street,
      suite: person.address.suite,
      city: person.address.city,
      zipcode: person.address.zipcode,
      geo: {
        lat: person.address.geo.lat,
        lng: person.address.geo.lng,
      },
    },
    phone: person.phone,
    website: person.website,
    company: {
      name: person.company.name,
      catchPhrase: person.company.catchPhrase,
      bs: person.company.bs,
    },
  });
};

export const deleteUser = (userId) => {
  return remove(`/users/${userId}`);
};
