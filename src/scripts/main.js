'use strict';

import { getUsers } from '../api/api';
import FormData from 'form-data';

const rootElementBodyTable = document.getElementById('table');
const rootElementHeadTable = document.getElementById('table-head');
const openButton = document.getElementById('open');
const closeButton = document.getElementById('close');
const form = document.getElementById('form');
const windowForm = document.querySelector('.users__forms');
const rootModal = document.getElementById('modalText');

openButton.addEventListener('click', () => {
  openButton.hidden = true;
  windowForm.setAttribute('class', 'users__forms--active');
});

closeButton.addEventListener('click', () => {
  openButton.hidden = false;
  windowForm.setAttribute('class', 'users__forms');
});

getUsers()
  .then(users => {
    let visibleUsers = [...users];

    initial(visibleUsers);

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const data = new FormData(form);

      if (data.get('name').trim().length > 0
        && data.get('username').trim().length > 0
        && data.get('email').trim().length > 0
        && data.get('website').trim().length > 0) {
        const person = {
          id: +(new Date()),
          name: data.get('name').trim(),
          username: data.get('username').trim(),
          email: data.get('email').trim(),
          address: {
            street: data.get('street').trim(),
            suite: data.get('suite').trim(),
            city: data.get('city').trim(),
            zipcode: data.get('zipcode').trim(),
            geo: {
              lat: data.get('lat').trim(),
              lng: data.get('lng').trim(),
            },
          },
          phone: data.get('phone').trim(),
          website: data.get('website').trim(),
          company: {
            name: data.get('name').trim(),
            catchPhrase: data.get('name').trim(),
            bs: data.get('name').trim(),
          },
        };

        openButton.hidden = false;
        windowForm.setAttribute('class', 'users__forms');
        visibleUsers = [...visibleUsers, person];
        initial(visibleUsers);

        event.target.reset();
      }
    });

    rootElementBodyTable.addEventListener('click', (event) => {
      if (event.target.matches('.remove')) {
        visibleUsers = visibleUsers
          .filter(user => user.id !== +event.target.id);
        initial(visibleUsers);
      }

      if (event.target.matches('.table__body--link')) {
        const selectedPerson = visibleUsers
          .find(user => user.name === event.target.textContent.trim());

        getExatcPerson(selectedPerson);
      }
    });

    rootElementHeadTable.addEventListener('click', (event) => {
      if (event.target.dataset.filter) {
        const type = event.target.dataset.filter;
        const filterFields = rootElementHeadTable
          .querySelectorAll('[data-filter]');

        filterFields.forEach(field => {
          field.classList
            .toggle('table__head--cell-selected', event.target === field);
        });

        switch (type) {
          case 'id':
            visibleUsers = [...visibleUsers]
              .sort((user1, user2) => user1.id - user2.id);
            initial(visibleUsers);
            break;

          case 'name':
          case 'username':
          case 'email':
          case 'website':
            visibleUsers = [...visibleUsers]
              .sort((user1, user2) => user1[type].localeCompare(user2[type]));

            initial(visibleUsers);
            break;

          default:
            initial(visibleUsers);
        }
      }
    });
  });

function initial(people) {
  openButton.hidden = false;

  rootElementBodyTable.innerHTML = `
    ${people.map(person => `
      <tr class="table__body--row">
        <td class="table__body--cell">
          <a
            href="#modal"
            class="table__body--link"
          >
            ${person.name}
          </a>
        </td>
        <td class="table__body--cell">
          ${person.username}
        </td>
        <td class="table__body--cell">
          ${person.email}
        </td>
        <td class="table__body--cell">
          ${person.website}
        </td>
        <td
          class="table__body--cell
          remove"
          id="${person.id}"
        >
          Delete
        </td>
      </tr>
      `).join('')}
  `;
  getModal();
}

function getExatcPerson(person) {
  rootModal.innerHTML = `
    <h2 class="modal__title">
      Detailed information about:
    </h2>
    <h3 class="modal__title3">
      ${person.name} ${person.username}
    </h3>
    <p class="modal__subtitle">
      adress:
    </p>
    <p class="modal__inner-text">
      street: ${person.address.street}
    </p>
    <p class="modal__inner-text">
      suite: ${person.address.suite}
    </p>
    <p class="modal__inner-text">
      city: ${person.address.city}
    </p>
    <p class="modal__inner-text">
      zipcode: ${person.address.zipcode}
    </p>
    <p class="modal__inner-text">
      geo:
    </p>
    <p class="modal__inner-text-geo">
      lat: ${person.address.geo.lat}
    </p>
    <p class="modal__inner-text-geo">
      lng: ${person.address.geo.lng}
    </p>
    <p
      class="modal__subtitle"
    >
      phone:
    </p>
    <p class="modal__inner-text">
      ${person.phone}
    </p>
    <p
      class="modal__subtitle"
    >
      website:
    </p>
    <p class="modal__inner-text">
      ${person.website}
    </p>
    <p class="modal__subtitle">
      company:
    </p>
    <p class="modal__inner-text">
      name: ${person.company.name}
    </p>
    <p class="modal__inner-text">
      catchPhrase: ${person.company.catchPhrase}
    </p>
    <p class="modal__inner-text">
      bs: ${person.company.bs}
    </p>
 `;
}

function getModal() {
  const modalLinks = document.querySelectorAll('.table__body--link');

  if (modalLinks.length > 0) {
    for (const modalLink of modalLinks) {
      modalLink.addEventListener('click', (event) => {
        const modalName = modalLink.getAttribute('href').replace('#', '');
        const currentModal = document.getElementById(modalName);

        modalOpen(currentModal);
        event.preventDefault();
      });
    }
  }

  const modalCloseIcon = document.querySelectorAll('.modal__closer--close');

  if (modalCloseIcon.length > 0) {
    for (const element of modalCloseIcon) {
      element.addEventListener('click', (event) => {
        modalClose(element.closest('.modal'));
        event.preventDefault();
      });
    }
  }

  function modalOpen(currentModal) {
    if (currentModal) {
      const modalActive = document.querySelector('.modal__open');

      if (modalActive) {
        modalClose(modalActive);
      }

      currentModal.classList.add('modal__open');

      currentModal.addEventListener('click', (event) => {
        if (!event.target.closest('.modal__content')) {
          modalClose(event.target.closest('.modal'));
        }
      });
    }
  }

  function modalClose(modalActive) {
    modalActive.classList.remove('modal__open');
  }
}
