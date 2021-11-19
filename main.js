function load() {
  const length = 6;
  const regExp = new RegExp(`^[0-9]{${length}}$`);
  const rules = [
    `Отвечайте в формате <strong>${''.padEnd(length, '0')}</strong> (${length} без пробелов)`,
    'После каждого хода отвечу сколько угадано всего цифр и сколько на правильных местах'
  ];
  const chatEl = document.querySelector('.chat');
  const userMessEl = document.querySelector('.user-mess');
  const menuBtnEl = document.querySelector('.menu-btn');
  const sendBtnEl = document.querySelector('.send-btn');

  const chatLink = cmd => `<span class="command">${cmd}</span>`;
  const arrToObj = (arr) => arr.reduce((res, cur) => (res[cur] = (res[cur] || 0) + 1) && res, {});

  const addMessageToChat = ({ type = 'pc', content }) => {
    if (content) {
      const timeStr = new Date().toLocaleTimeString().substr(0, 5);
      const newMsg = `<div class="message message-${type}" data-time="${timeStr}">${content}</div>`
      chatEl.insertAdjacentHTML("beforeend", newMsg);
      chatEl.lastChild.scrollIntoView();
    }
  };

  const addNewGameMsg = () => addMessageToChat({ type: 'menu', content: ` Для запуска новой игры: ${chatLink('newgame')}` });
  addNewGameMsg();
  let gameObj;

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
      //addMessageToChat({ content: combination.join('') });
      gameObj = { combination, move: 0, combinationObj: arrToObj(combination)};
    }
  };

  const showMenu = () => {
    const menu = 'Доступные команды<br/>' +
      Object.keys(cmdObj).map(x => chatLink(x)).join('<br/>');
    addMessageToChat({ type: 'menu', content: menu })
  }

  const userMove = (current) => {
    if (gameObj) {
      gameObj.move++;
      const currentObj = arrToObj(current);
      const { combinationObj, combination, move } = gameObj;
      let rightNum = 0;
      let rightPlace = 0;
      combination.forEach((x, i) => {
        if (x === current[i]) { rightPlace++;}
      });
      Object.keys(combinationObj).forEach(x => {
        const combiVal = combinationObj[x] || 0;
        const curVal = currentObj[x] || 0;
        rightNum += combiVal < curVal ? combiVal : curVal;
      });     
      if (rightPlace === 6) {
        addMessageToChat({ content: `ход ${move.toString().padEnd(2, ' ')} Поздравляю с победой!` });
        addNewGameMsg();
      } else {
         addMessageToChat({ content: `ход ${move.toString().padEnd(2, ' ')} угадано цифр ${rightNum}, на своём месте ${rightPlace}` });
      } 
    } else { 
      addMessageToChat({ content: 'Игра не начата' });
    }

  }

  const analizeCommand = (command) => {
    document.querySelectorAll('.message-menu').forEach(x => x.remove());
    addMessageToChat({ type: 'my', content: command });

    const [cmd, ...params] = command.split(' ');
    const cmdFunc = cmdObj[cmd];
    if (typeof (cmdFunc) === 'function') {
      cmdFunc(...params);
    } else if (regExp.test(cmd)){
      userMove(cmd.split('').map(x => +x));
    } else {
      addMessageToChat({ content: 'Неизвестная команда' });
    }    
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

