// Constants
const MAX_LIST_ITEMS = 2;
const LS_IDENTIFIER = "ui-practice-hobby-list";
const HOBBY_TYPES = {
  mine: "mine",
  friend: "friend",
};

const SHOW_MORE_TEXT = ["интерес", "интереса", "интересов"];

const initialState = {
  mine: [
    "Хоккей",
    "Высокоточная вёрстка под старые версии Microsoft Internet Explorer, начиная с версии 5.01",
    "Стрельба из арбалета",
    "Плавание на дистанции до 10 метров",
  ],
  friend: [
    {
      name: "Баскетбол",
      isMine: false,
    },
    {
      name: "Нарезка Photoshop/Fireworks макетов на скорость, в экстримельных условиях, на природе",
      isMine: false,
    },
    {
      name: "Воллейбол",
      isMine: false,
    },
    {
      name: "Укращение диких котят в домашних условиях",
      isMine: false,
    },
    {
      name: "Стрельба резинками для волос на длинные дистанции",
      isMine: false,
    },
  ],
  isMineOpen: false,
  isFriendOpen: false,
};

let state = null;

// Nodes
const hobbyForm = document.getElementById("hobby-form");
const hobbyInput = document.getElementById("hobby-input");

const mineHobbyList = document.getElementById("mein-hobby-list");
const friendHobbyList = document.getElementById("friend-hobby-list");

const showMoreMine = document.getElementById("show-more-mine");
const showMoreFriend = document.getElementById("show-more-friend");

// Handling showMore Button

function toggleShowMine() {
  state.isMineOpen = !state.isMineOpen;
  renderMineHobbies();
  handleShowMoreMine();
}
function toggleShowFriend() {
  state.isFriendOpen = !state.isFriendOpen;
  renderFriendHobbies();
  handleShowMoreFriend();
}

function checkIsShowMoreMineVisible() {
  if (state.mine.length > MAX_LIST_ITEMS) {
    showMoreMine.classList.add("active");
    return;
  }
  showMoreMine.classList.remove("active");
}

function checkIsShowMoreFriendVisible() {
  if (state.friend.length > MAX_LIST_ITEMS) {
    showMoreFriend.classList.add("active");
    return;
  }
  showMoreFriend.classList.remove("active");
}

function handleShowMoreMine() {
  checkIsShowMoreMineVisible();

  if (state.isMineOpen) {
    showMoreMine.textContent = "скрыть";
    showMoreMine.setAttribute("title", "Скрыть список");
  }

  if (!state.isMineOpen) {
    const extraQuantity = state.mine.length - MAX_LIST_ITEMS;
    showMoreMine.textContent = `еще ${extraQuantity} ${getTextOnQuantity(
      extraQuantity,
      SHOW_MORE_TEXT,
    )}`;
    showMoreMine.setAttribute("title", "Показать больше интересов");
  }
}

function handleShowMoreFriend() {
  checkIsShowMoreFriendVisible();

  if (state.isFriendOpen) {
    showMoreFriend.textContent = "скрыть";
    showMoreFriend.setAttribute("title", "Скрыть список");
  }

  if (!state.isFriendOpen) {
    const extraQuantity = state.friend.length - MAX_LIST_ITEMS;
    showMoreFriend.textContent = `еще ${extraQuantity} ${getTextOnQuantity(
      extraQuantity,
      SHOW_MORE_TEXT,
    )}`;
    showMoreFriend.setAttribute("title", "Показать больше интересов");
  }
}

function checkIsMine(hobby) {
  const hobbyMatch = state?.friend?.find((el) => el?.name === hobby);
  if (!hobbyMatch) {
    return;
  }
  hobbyMatch.isMine = !hobbyMatch.isMine;
  renderFriendHobbies();
}

function updateLocalStorage() {
  localStorage.setItem(LS_IDENTIFIER, JSON.stringify(state));
}

function addMineHobby(hobbyName) {
  if (state.mine.find((h) => h === hobbyName)) {
    return;
  }
  state.mine.unshift(hobbyName);

  checkIsMine(hobbyName);
  updateLocalStorage();
  renderAllHobbies();
  handleShowMoreMine();
}

function removeMineHobby(hobbyName) {
  state.mine = state.mine.filter((h) => h !== hobbyName);
  checkIsMine(hobbyName);
  updateLocalStorage();
  renderAllHobbies();
  handleShowMoreMine();
}

function getHobbyHTML(type, hobby) {
  if (type === HOBBY_TYPES.mine) {
    return `
    <li tabindex="0" class="hobby-list_item hobby-list_item--friend">
      <button
        tabindex="0"
        class="hobby-list_item-button hobby-list_item-button--mine"
        title="Удалить хобби"
        onclick="removeMineHobby('${hobby}')"
      >
        <img
          src="public/close.png"
          alt="Удалить"
          width="16px"
          height="16px"
        />
      </button>
      <p class="hobby-list_item-text">${hobby}</p>
    </li>
    `;
  }

  if (type === HOBBY_TYPES.friend) {
    return `
      <li tabindex="0" class="hobby-list_item hobby-list_item--friend">
        <button
          tabindex="0"
          class="hobby-list_item-button hobby-list_item-button--friend ${
            hobby.isMine ? "is-mine" : ""
          }"
          title="Добавить в свои хобби"
          onclick="addMineHobby('${hobby?.name}')"
        >
          <img
            src="public/add.gif"
            alt="Добавить"
            width="16px"
            height="16px"
          />
        </button>
        <p class="hobby-list_item-text hobby-list_item-text--friend">${
          hobby?.name
        }<span class="friend_is-mine-text ${
      hobby.isMine ? "is-mine" : ""
    }"><img src="public/ok.png" alt="Добавлено"/>добавлено в ваши увлечения</span></p>
        <button tabindex="0" class="friend_complain-button"><img src="public/warn.png" alt="Пожаловаться"/><span>пожаловаться</span></button>
      </li>
      `;
  }
}

function renderMineHobbies() {
  const hobbiesList = state.isMineOpen
    ? state.mine
    : state.mine.slice(0, MAX_LIST_ITEMS);
  const mineHobbies = hobbiesList.map((hobby) =>
    getHobbyHTML(HOBBY_TYPES.mine, hobby),
  );

  mineHobbyList.innerHTML = mineHobbies.join("");
}

function renderFriendHobbies() {
  const hobbiesList = state.isFriendOpen
    ? state.friend
    : state.friend.slice(0, MAX_LIST_ITEMS);
  const friendHobbies = hobbiesList.map((hobby) =>
    getHobbyHTML(HOBBY_TYPES.friend, hobby),
  );
  friendHobbyList.innerHTML = friendHobbies.join("");
}

function renderAllHobbies() {
  renderMineHobbies();
  renderFriendHobbies();
}

function getTextOnQuantity(num, textArr) {
  num = Math.abs(num) % 100;
  const n1 = num % 10;
  if (num > 10 && num < 20) {
    return textArr[2];
  }
  if (n1 > 1 && n1 < 5) {
    return textArr[1];
  }
  if (n1 == 1) {
    return textArr[0];
  }
  return textArr[2];
}

function submitForm(e) {
  e.preventDefault();

  const value = hobbyInput.value.trim();
  if (!value) {
    return;
  }

  addMineHobby(value);
  hobbyInput.value = "";
}

function init() {
  state = JSON.parse(localStorage.getItem(LS_IDENTIFIER)) || initialState;
  updateLocalStorage();

  hobbyForm.addEventListener("submit", submitForm);

  renderAllHobbies();
  handleShowMoreMine();
  handleShowMoreFriend();
}

init();
