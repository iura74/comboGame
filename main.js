function load() {
  const length = 6;
  const rules = [
    `Отвечайте в формате <strong>${''.padEnd(length, '0')}</strong> (${length} без пробелов)`,
    'После каждого хода отвечу сколько угадано всего цифр и сколько на правильных местах'
  ];
  const chatEl = document.querySelector('.chat');
  const userMessEl = document.querySelector('.user-mess');
  const menuBtnEl = document.querySelector('.menu-btn');
  const sendBtnEl = document.querySelector('.send-btn');


  const addMessageToChat = ({ type = 'pc', content }) => {
    if (content) {
      const timeStr = new Date().toLocaleTimeString().substr(0, 5);
      const newMsg = `<div class="message message-${type}" data-time="${timeStr}">${content}</div>`
      chatEl.insertAdjacentHTML("beforeend", newMsg);
      chatEl.lastChild.scrollIntoView();
    }
  };



  const cmdObj = {
    menu() {
      showMenu();
    },
    clear() {
      chatEl.textContent = '';
    },
    newgame() {
      const combination = []
      for (let i = 0; i < length; i++) {
        combination.push(~~(Math.random() * 10));
      }
      addMessageToChat({ content: `Я загадал комбинацию из ${length} цифр, попробуйте угадать! <br/> ${rules.join('<br/>')}` });
      addMessageToChat({content: combination.join('')});
    }

  };

  const showMenu = () => {
    const menu = 'Доступные команды<br/>' +
      Object.keys(cmdObj).map(x => `<span class="command">${x}</span>`).join('<br/>');
    addMessageToChat({ type: 'menu', content: menu })
  }

  const analizeCommand = (command) => {
    document.querySelectorAll('.message-menu').forEach(x => x.remove());
    addMessageToChat({ type: 'my', content: command });

    const [cmd, ...params] = command.split(' ');
    const cmdFunc = cmdObj[cmd];
    if (typeof (cmdFunc) === 'function') {
      cmdFunc(...params);
      return;
    }

    addMessageToChat({ content: 'Неизвестная команда' });
  };

  const sendCommand = () => {
    if (userMessEl.value) {      
      analizeCommand(userMessEl.value);
      userMessEl.value = '';
    }
  };

  userMessEl.addEventListener('keyup', ({ keyCode }) => {
    if (keyCode === 13) {
      sendCommand();
      return true;
    }
  });

  sendBtnEl.addEventListener('click', sendCommand);
  menuBtnEl.addEventListener('click', () => analizeCommand('menu'));

  chatEl.addEventListener('click', ({ target }) => {    
    if (target.classList.contains("command")) {
      analizeCommand(target.textContent);
    }
  });
};


document.addEventListener("DOMContentLoaded", load);

