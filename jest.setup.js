// jest.setup.js

// Importe les matchers étendus de jest-dom (ex: .toBeInTheDocument())
// pour qu'ils soient disponibles dans tous les tests
import "@testing-library/jest-dom";

// Ajoutez ici d'autres configurations globales pour vos tests si nécessaire
// Par exemple, mocker des API globales comme fetch, localStorage, etc.

// Exemple de mock simple pour localStorage (si vous l'utilisez)
/*
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    },
    removeItem: function(key) {
      delete store[key];
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
*/
