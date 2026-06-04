import { initialCars } from '../data/seed';

const get = (key, fallback) => {
  const data = localStorage.getItem(key);
  if (!data) return fallback;
  try { return JSON.parse(data); } catch { return fallback; }
};

const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const db = {
  init() {
    if (!localStorage.getItem('cars')) set('cars', initialCars);
    if (!localStorage.getItem('users')) set('users', []);
    if (!localStorage.getItem('proposals')) set('proposals', []);
    if (!localStorage.getItem('messages')) set('messages', []);
  },
  getUsers: () => get('users', []),
  saveUsers: users => set('users', users),
  getCars: () => get('cars', initialCars),
  saveCars: cars => set('cars', cars),
  getProposals: () => get('proposals', []),
  saveProposals: proposals => set('proposals', proposals),
  getMessages: () => get('messages', []),
  saveMessages: messages => set('messages', messages),
  getLoggedUser: () => get('loggedUser', null),
  setLoggedUser: user => set('loggedUser', user),
  logout: () => localStorage.removeItem('loggedUser')
};
