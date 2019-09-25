// В рамках тестового задания мы не ожидаем сложной структуры JS кода.
// Мы ожидаем:
// - именование функций и переменных согласно предназначению
// - создание функций согласно действиям интерфейса

// Если проанализировать форму логина, то можно выделить основные функции
// 1. Вход - tryLogin()
// 2. Отображение ошибки авторизации - showLoginError()

const loginForm = document.querySelector(".login-form");
const loginFormEmail = document.querySelector(".login-form__email");
const loginFormPassword = document.querySelector(".login-form__password");
const loginFormError = document.querySelector(".login-form__error");
const loginFormSubmitButton = document.querySelector(".login-form__submit");

// Функция отправки запроса на сервер выделена отдельно,
// чтобы не смешивать технические детали отправки данных
// с логикой приложения

// В реальном проекте функция login была бы разделена на две части
// 1) http.request() — функция, которая выполняет произволный http запрос c заданными парметрами
// 2) api.login() — функции взаимодействия с бэкендом обычно объединяют в отдельный модуль api

async function login({ email, password }) {
  const url = "https://us-central1-mercdev-academy.cloudfunctions.net/login";
  const params = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "post",
    body: JSON.stringify({ email, password })
  };

  const reponse = await fetch(url, params);
  const json = await reponse.json();

  if (reponse.ok) {
    return json;
  } else {
    throw new Error(json.error);
  }
}

// В сложных приложениях обычно есть некоторая третья сторона,
// обеспечивающая связь между двумя разными экранами/страницами.
// В идеале форма логина не должна ничего знать ни про профиль,
// ни про какие-либо другие части приложения
// Но в рамках ТЗ это не принципиально

async function tryLogin(event) {
  event.preventDefault();

  const loginFormData = new FormData(loginForm);
  const email = loginFormData.get("email");
  const password = loginFormData.get("password");

  disableLoginForm();
  hideLoginError();

  try {
    const user = await login({ email, password });
    showUserProfile(user);
  } catch (error) {
    showLoginError(error.message);
  } finally {
    enableLoginForm();
  }
}

// Подсветка полей выделена в отдельные функции
// т.к. сброс подсветки может происходить независимо
// от скрытия сообщения об ошибке

function showLoginValidationError() {
  loginFormEmail.classList.add("text-input--invalid");
  loginFormPassword.classList.add("text-input--invalid");
}

function hideLoginValidationError() {
  loginFormEmail.classList.remove("text-input--invalid");
  loginFormPassword.classList.remove("text-input--invalid");
}

function showLoginError(message) {
  loginFormError.innerText = message;
  loginFormError.removeAttribute("hidden");
  showLoginValidationError();
}

function hideLoginError() {
  loginFormError.setAttribute("hidden", "true");
  hideLoginValidationError();
}

// Отправка формы на сервер — это асинхронная операция
// Хорошей практикой является блокировка формы до получения ответа,
// чтобы избежать дублирующих запросов

function disableLoginForm() {
  loginFormEmail.setAttribute("disabled", "true");
  loginFormPassword.setAttribute("disabled", "true");
  loginFormSubmitButton.setAttribute("disabled", "true");
}

function enableLoginForm() {
  loginFormEmail.removeAttribute("disabled");
  loginFormPassword.removeAttribute("disabled");
  loginFormSubmitButton.removeAttribute("disabled");
}

// Связь функций с DOM
// Обратите внимание, как именование переменных влияет на читаемость кода.
// Можно не вдаваясь в детали реализации понять,
// что при сабмите формы будет произведена попытка залогиниться.

// А ври вводе (событие input) данных в поля ввода email и password,
// будут скрываться ошибки валидации (подсветка)

loginForm.addEventListener("submit", tryLogin);
loginFormEmail.addEventListener("input", hideLoginValidationError);
loginFormPassword.addEventListener("input", hideLoginValidationError);

// Для блока с профилем пользователя релевантны следующие функции
// - 1. Отобразить пользователя — showUserProfile()
// - 2. Выйти - logout()

const userProfile = document.querySelector(".user-profile");
const userProfileName = document.querySelector(".user-profile__name");
const userProfileAvatar = document.querySelector(".user-profile__avatar");
const userProfileLogoutButton = document.querySelector(".user-profile__logout");

function showUserProfile(user) {
  loginForm.setAttribute("hidden", "true");

  userProfileName.innerText = user.name;
  userProfileAvatar.setAttribute("src", user.photoUrl);
  userProfile.removeAttribute("hidden");
}

// В рамках ТЗ это может быть простая перезагрузка страницы
// В реальных приложениях перед этим должна произойти очистка информации о сессии
// сброс куки или удаления токена авторизации

function logout() {
  window.location.reload();
}


userProfileLogoutButton.addEventListener("click", logout);
