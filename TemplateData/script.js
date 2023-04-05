// Log
const vkGoal = (type, parameters) => {
  if (typeof VK !== 'undefined') VK.Goal(type, parameters);
};

const logMetrica = (type, parameters) => {
  const json = JSON.stringify(parameters);
  if (window.logym) {
    window.logym(type)
  }

  if (window.REV) {
    if (REV.logEvent) window.REV.logEvent(type, json);
    else REV.REV_EVENTS.push({ name: type, data: json });
  }
};


const logClick = (label) => {
  logMetrica(label, { Label: label });
};

const logTouchScreenKeyboard = (inputName, status, isActive) => {
  logMetrica('TouchScreenKeyboard', {
    [inputName]: `status:${status}; active:${isActive}`,
  });
};

const logOpenForm = (n) => {
  logMetrica('FormOpen', { Form: n });
};
const logCloseForm = (n) => {
  logMetrica('FormClose', { Form: n });
};

const addListenersToInput = (input, name) => {
  const handler = (changed) => {
      logTouchScreenKeyboard(
        name,
        changed ? 'ValueChanged' : 'Null',
        'False'
      );
    }
  const focusHandler = (e) => {
    handler(false)
  }
  const inputHandler = (e) => {
    input.removeEventListener('input', inputHandler)
    handler(true);
  }
  input.addEventListener('focus', focusHandler);
  input.addEventListener('input', inputHandler);
};

// Notifications
const rootNotifications = document.getElementsByClassName('notifications')[0];

const closeNotifications = () => {
  const notification = document.querySelector('.notificationAnimation');
  if (notification) {
    notification.classList.add('notificationAnimation--animate');
    setTimeout(() => {
      rootNotifications.innerHTML = '';
    }, 500);
  }
};

const topNotificationActions = (notification, name, withOutAutoClose) => {
  const closeButton = notification.getElementsByClassName(
    'topNotification__close'
  )[0];

  let closeTimeOut;

  if (!withOutAutoClose) {
    closeTimeOut = setTimeout(() => {
      closeNotification();
    }, 4000);  
  }


  const closeNotification = () => {
    closeButton.removeEventListener('click', closeNotification);
    notification.classList.add('topNotificationanimation--animate');
    clearTimeout(closeTimeOut);
    setTimeout(() => {
      logCloseForm(name);
      notification.remove();
    }, 700);
  };

  closeButton.addEventListener('click', closeNotification);
};

const showTopNotification = (text, name, isError = true, isLong = false, withOutAutoClose = false) => {
  if (document.getElementsByClassName('topNotificationanimation')[0]) return;
  const notification = document.createElement('div');
  notification.className = 'topNotificationanimation';
  notification.innerHTML =
    `<div class="topNotification ${isLong ? "topNotification--long" : ""}"><div class="topNotification__warning"><img src="TemplateData/warning.png" alt="warning"></div><p class="topNotification__text">${text}</p><div class="topNotification__close"><img src="TemplateData/close.png" alt="close"></div></div`;
    
  rootNotifications.appendChild(notification);

  topNotificationActions(notification, name, withOutAutoClose);
  if (isError) {
    logMetrica('ErrorPopup', { NotificationPopup: traslitor(text) });
  }
  logOpenForm(name);
}


const showNotMemberNotification = () => {
  const notification = document.createElement('div');

  notification.className = 'notification';

  notification.innerHTML =
    '<div class="notificationAnimation"><div class="notification__content notMemberNotification"><h2 class="notification__contentTitle mainTitle">Упс! Я не нашел тебя среди участников «СберСпасибо»</h2><p class="mainDesc notification__contentDesc">Если ты ещё не подключен к программе лояльности, самое время это исправить!</p><a class="button" href="https://spasibosberbank.ru/how_it_works#with_card" target="_blank">Присоединиться <br> к программе</a></div></div>';

  rootNotifications.appendChild(notification);
  logMetrica('ErrorPopup', { NotificationPopup: 'IsNotRegisterSpasiboPopup(Clone)' });
  logOpenForm('NotRegisterSpasibo(Clone)');
};
const showNotCorrectFormNotification = () => {
  showTopNotification("Проверь данные. Номер телефона и/или дата рождения введены некорректно", 'NotificationForm(Clone)')
};
const showBlockedNotification = () => {
  showTopNotification("Аккаунт и бонусный счет заблокированы из-за подозрения в злоупотреблении правилами акции. Для участия в разборе ситуации обратитесь по номеру 900 (далее скажите: БОНУСЫ СБЕРСПАСИБО)<br />в течение 30 календарных дней.", "FrodNotificationForm(Clone)", true, true, true)
};
const showRetrySMSNotification = () => {
  showTopNotification("Код отправлен повторно", "NotificationForm(Clone)", true)
};
const showNeedConsentNotification = () => {
  showTopNotification("Необходимо дать согласия", "NotificationForm(Clone)")
};
const showSomethingWrongNotification = () => {
  showTopNotification("Что-то пошло не так...", "NotificationForm(Clone)")
};
const showSomethingWrongRefreshNotification = () => {

};
const showNotCorrectSmsNotification = () => {
  showTopNotification("Неверный код. Проверь правильность данных", "NotificationForm(Clone)")
};
const showIpLockedSmsNotification = () => {
  showTopNotification("Ip заблокирован", "NotificationForm(Clone)")
};

const httpErrorsCodes = {
  [10005]: () => showTopNotification("Токен игрока активен", "NotificationForm(Clone)"),
  [10006]: () => showTopNotification("Игрок уже зарегистрирован", "NotificationForm(Clone)"),
  [10010]: () => showTopNotification("Ошибка отправки СМС", "NotificationForm(Clone)"),
  [10012]: () => showTopNotification("Недействительный токен приложения", "NotificationForm(Clone)"),
  [10003]: () => showTopNotification("Неправильный формат телефона", "NotificationForm(Clone)"),
  [10004]: () => showTopNotification("Неправильный формат даты", "NotificationForm(Clone)"),
  [10029]: () => showTopNotification("Авторизация не удалась", "NotificationForm(Clone)"),
  [10058]: () => showTopNotification("Игра на обслуживании", "NotificationForm(Clone)"),
  [10002]: () => showTopNotification("Токен игрока недействителен/отсутствует", "NotificationForm(Clone)"),
  [10035]: () => showTopNotification("Недостаточно баллов для транзакций", "NotificationForm(Clone)"),
  [10038]: () => showTopNotification("Ошибка обработки транзакции. Обратное будет сделано в фоновом режиме", "NotificationForm(Clone)"),
  [10042]: () => showTopNotification("Недостаточно шагов для транзакции", "NotificationForm(Clone)"),
  [10026]: () => showTopNotification("Ошибка отправки СМС", "NotificationForm(Clone)"),
  [10011]: () => showTopNotification("Общий сбой системы", "NotificationForm(Clone)"),
  [10065]: () => showTopNotification("Ошибка при выборе: пошаговые пакеты", "NotificationForm(Clone)"),
  [10068]: () => showTopNotification("Ошибка при выборе: награды", "NotificationForm(Clone)"),
  [10032]: () => showTopNotification("Игрок не авторизован", "NotificationForm(Clone)"),
}

window.addEventListener('click', (e) => {
  const withinBoundaries = e
    .composedPath()
    .includes(document.querySelector('.notification__content'));

  if (!withinBoundaries && document.querySelector('.notification__content')) {
    logCloseForm('NotRegisterSpasibo(Clone)');
    closeNotifications();
  }
});

// UnityApi

class UnityApi {
  static unityStack = [];
  static isUnityLoaded = false;

  static addToStack = (callback) => {
    UnityApi.unityStack.push(callback);
    if (UnityApi.isUnityLoaded) {
      UnityApi.execStack();
    }
  };

  static execStack = () => {
    UnityApi.unityStack.forEach((callback) => {
      callback();
    });
    UnityApi.unityStack = [];
  };

  static completeUnity = () => {
    UnityApi.isUnityLoaded = true;
    UnityApi.execStack();
  }
}

// Utils
let userNumber = '';
let isRegister = false;

const onYearOpen = (e) => {
  let yearsList = document.getElementsByClassName('yearsList')[1];
  yearsList.scrollTop = 300;
};

const traslitor = (str) => {
  let ret = "";
  const rus = ["А","Б","В","Г","Д","Е","Ё","Ж", "З","И","Й","К","Л","М", "Н", "О","П","Р","С","Т","У","Ф","Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ы","Ь", "Э","Ю", "Я"," ",".","," ];
  const eng = ["A","B","V","G","D","E","E","ZH","Z","I","Y","K","L","M","N", "O","P","R","S","T","U","F","KH","TS","CH","SH","SHCH","!","Y","'", "E","YU","YA"," ",".",","];

  for (let j = 0; j < str.length; j++) {
    for (let i = 0; i < rus.length; i++) {
      if (str[j].toUpperCase() == rus[i]) {
        ret += eng[i];
        break;
      }
    }
  }
  return ret.toLowerCase();
}


const smsCodeList = document.getElementsByClassName('inputField__smsInput');
let isSmsLoading = false;

addListenersToInput(smsCodeList[0], 'SmsInput');

for (let i = 0; i < smsCodeList.length; i++) {
  smsCodeList[i].addEventListener('input', async (e) => {
    if (!/[0-9]/.test(e.target.value)) {
      e.target.value = '';
      return;
    }

    if (e.target.value.length > 1) {
      const value = e.target.value.replaceAll(/\D/g, '');
      for (let j = 0; j < value.length; j++) {
        const element = value[j];
        if (smsCodeList[i + j]) {
          smsCodeList[i + j].value = element;
        }
      }
    }

    if (i < smsCodeList.length - 1 && e.target.value) {
      smsCodeList[i + 1].focus();
    }
    const sms1 = document.getElementById('sms1').value;
    const sms2 = document.getElementById('sms2').value;
    const sms3 = document.getElementById('sms3').value;
    const sms4 = document.getElementById('sms4').value;
    const sms5 = document.getElementById('sms5').value;
    const sms6 = document.getElementById('sms6').value;
    if (
      sms1.length &&
      sms2.length &&
      sms3.length &&
      sms4.length &&
      sms5.length &&
      sms6.length && 
      !isSmsLoading
    ) {
      try {
        smsCodeList[5].blur();
        isSmsLoading = true;
        document.body.click();
        const request = isRegister ? Api.regStopTwo : Api.authStopTwo;
        await request(`${sms1}${sms2}${sms3}${sms4}${sms5}${sms6}`);
        UnityApi.addToStack(() => {
          window.UNITY.SendMessage('Network', 'CompleteAuth');
        });
        logMetrica('SMSAuth');
        setTimeout(() => {
          goto('game');
        }, 400)
      } catch (e) {
        if (e.problem && e.problem.code === '10911') {
          showBlockedNotification();
        } 
        else if (e.problem && e.problem.code === '10027') {
          showNotCorrectSmsNotification();
        }
        else {
          showSomethingWrongNotification();
        }
      }
      finally {
        isSmsLoading = false;
      }
    }
  });
  smsCodeList[i].addEventListener('keydown', (e) => {
    if (i > 0 && (e.keyCode === 8 || e.keyCode === 229)) {
      e.preventDefault();
      if (i === smsCodeList.length - 1 && smsCodeList[i].value.length) {
        smsCodeList[i].value = '';
        return;
      }
      smsCodeList[i - 1].value = '';
      smsCodeList[i - 1].focus();
    }
  });
  smsCodeList[i].addEventListener('focus', (e) => {
    let item = 0;
    let focused = false;

    while (!focused && item < smsCodeList.length) {
      if (smsCodeList[item].value.length && item !== smsCodeList.length - 1) {
        item++;
      } else {
        smsCodeList[item].focus();
        focused = true;
      }
    }
  });
}

let array = ['TemplateData/warning.png', 'TemplateData/close.png'];

let imageCount = 0;

for (let i = 0; i < array.length; i++) {
  let img = new Image();
  img.src = array[i];
}

addListenersToInput(document.getElementById('phone'), 'PhoneInput');

[].forEach.call(document.querySelectorAll('.button'), function (button) {
  button.addEventListener('touchstart', (e) => e.target.classList.add('active'))
  button.addEventListener('touchend', (e) => e.target.classList.remove('active'))
})

window.addEventListener('DOMContentLoaded', function () {
  [].forEach.call(document.querySelectorAll('.tel'), function (input) {
    var keyCode;
    var prevValue;
    var isStart = true;
    function mask(event) {
      event.keyCode && (keyCode = event.keyCode);
      
      if ((this.value === "+7 7" || this.value === "+7 8") && prevValue === "+7 " && isStart && keyCode === 229) {
        this.value = "+7 ";
        isStart = false;
        return;
      }

      let pos = this.selectionStart;
      const isEndLinePos = this.value.length === pos;
      var matrix = '+7 (___) ___ - __ - __',
        i = 0,
        def = matrix.replace(/\D/g, ''),
        val = this.value.replace(/\D/g, ''),
        new_value = matrix.replace(/[_\d]/g, function (a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
        });
      i = new_value.indexOf('_');
      new_value = new_value.substring(0, 1) + 7 + new_value.substring(2);
      if (new_value.length === 1) {
        new_value = "+7" + this.value + new_value.substring(5);
      }

      if ((keyCode === 55 || keyCode === 56) && this.value.length === 0) {
        event.preventDefault();
      }

      if (i != -1) {
        i < 5 && (i = this.value.length && (keyCode === 8) ? 0 : 3);
        new_value = new_value.slice(0, i);
      }

      var reg = matrix
        .substr(0, this.value.length)
        .replace(/_+/g, function (a) {
          return '\\d{1,' + a.length + '}';
        })
        .replace(/[+()]/g, '\\$&');
      reg = new RegExp('^' + reg + '$');

      if (
        !reg.test(this.value) ||
        this.value.length < 5 ||
        (keyCode > 47 && keyCode < 58)
      )
        this.value = new_value;
      if (event.type == 'blur' && this.value.length < 5) this.value = '';

      if (event.type === 'input') {
        this.setSelectionRange(pos, pos);
      }
      if (isEndLinePos) {
        this.setSelectionRange(new_value.length, new_value.length);
      }
      prevValue = this.value;
      if (event.inputType === "deleteContentBackward" && this.value === "+7 ") {
        this.value = ""
      }
      if (!this.value) {
        isStart = true;
      }
    }
    
    input.addEventListener('keydown', mask);
    input.addEventListener('input', mask);
    // input.addEventListener('focus', mask);
    // input.addEventListener('blur', mask);
  });
});

const dateFormater = (year, month, day) => {
  const newMonth = month < 10 ? `0${month}` : month;
  const newDay = day < 10 ? `0${day}` : day;
  return `${year}-${newMonth}-${newDay}`;
};

const generateYears = () => {
  const yearSelect = document.getElementsByClassName('yearsList')[0];
  const minYear = 1900;
  const maxYear = 2005;

  const selectPlaceholder = document.createElement('option');
  selectPlaceholder.value = 0;
  selectPlaceholder.innerHTML = 'гггг';
  yearSelect.appendChild(selectPlaceholder);

  for (let i = maxYear; i >= minYear; i--) {
    const selectItem = document.createElement('option');
    selectItem.value = i;
    selectItem.innerHTML = i;
    yearSelect.appendChild(selectItem);
  }
};

const initCustomSelects = () => {
  let x, i, j, l, ll, selElmnt, b, c;
  x = document.getElementsByClassName('custom-select');
  l = x.length;
  for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName('select')[0];
    let className = selElmnt.className || '';
    ll = selElmnt.length;
    const a = document.createElement('DIV');
    a.setAttribute('class', 'inputField__placeholder select-selected');
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    b = document.createElement('DIV');
    b.setAttribute('class', `select-items select-hide ${className}`);
    for (j = 1; j < ll; j++) {
      c = document.createElement('DIV');
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener('click', function (e) {
        let y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName('select')[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName('same-as-selected');

            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute('class');
            }
            this.setAttribute('class', 'same-as-selected');
            a.classList.remove('inputField__placeholder');
            break;
          }
        }
        h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener('click', function (e) {
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle('select-hide');
      onYearOpen();
      this.classList.toggle('select-arrow-active');
    });
  }
  function closeAllSelect(elmnt) {
    let x,
      y,
      i,
      xl,
      yl,
      arrNo = [];
    x = document.getElementsByClassName('select-items');
    y = document.getElementsByClassName('select-selected');
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i);
      } else {
        y[i].classList.remove('select-arrow-active');
      }
    }
    for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add('select-hide');
      }
    }
  }

  document.addEventListener('click', closeAllSelect);
};

const restartSelects = () => {
  const items = document.getElementsByClassName('custom-select');
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    item.getElementsByClassName('select-selected')[0] &&
      item.getElementsByClassName('select-selected')[0].remove();
    item.getElementsByClassName('select-items')[0] &&
      item.getElementsByClassName('select-items')[0].remove();
    item.getElementsByTagName('select')[0].value = '0';
  }

  initCustomSelects();
};

// Api
class Api {
  static rootUrl = 'https://igra-sber.dev.itrev.ru';
  static ipAdreess = ''

  static getFrontId = () => window.FRONT_ID;

  static fetchIp = async () => {
    const resp = await fetch('https://ipapi.co/json/')
    const json = await resp.json()
    Api.ipAdreess = json.ip;
  }

  static api = async (url, config) => {
    const responce = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': Api.ipAdreess,
        'User-Agent': navigator.userAgent
      },
      ...config,
    });
    const json = await responce.json();
    if (responce.ok) {
      return json;
    } else {
      if (json.problem && json.problem.code === '20030') {
        showIpLockedSmsNotification();
      }
      if (json.problem && json.problem.code === '10911') {
        showBlockedNotification();
      }
      else if (json.problem && json.problem.code === '10037') {
        showBlockedNotification();
      }
      else if (json.problem && httpErrorsCodes[json.problem.code]) {
        httpErrorsCodes[json.problem.code]()
      }
      throw json;
    }
  };

  static authStepOne = (PHONE, BDATE) => {
    return Api.api(`${Api.rootUrl}/auth/step-one?frontId=${Api.getFrontId()}`, {
      method: 'POST',
      body: JSON.stringify({
        data: { PHONE, BDATE },
      }),
    });
  };
  static regStepOne = (PHONE, BDATE) => {
    return Api.api(`${Api.rootUrl}/reg/step-one?frontId=${Api.getFrontId()}`, {
      method: 'POST',
      body: JSON.stringify({
        data: { PHONE, BDATE, TERMS: true, REGULATIONS: true },
      }),
    });
  };

  static authStopTwo = (SMS) => {
    return Api.api(`${Api.rootUrl}/auth/step-two?frontId=${Api.getFrontId()}`, {
      method: 'POST',
      body: JSON.stringify({
        data: { SMS },
      }),
    });
  };
  static regStopTwo = (SMS) => {
    return Api.api(`${Api.rootUrl}/reg/step-two?frontId=${Api.getFrontId()}`, {
      method: 'POST',
      body: JSON.stringify({
        data: { SMS },
      }),
    });
  };
}

// Sign in

const signInAction = async () => {
  const phoneNumber = document.getElementById('phone').value;
  const day = document.getElementById('day').value;
  const month = document.getElementById('month').value;
  const year = document.getElementById('year').value;

  if (phoneNumber.length === 22 && +day && +month && +year) {
    logClick('click_button_voiti');
    vkGoal('conversion', 'click_button_voiti');
    try {
      userNumber = phoneNumber;
      await Api.authStepOne(
        phoneNumber.replace(/[ \(\)+-]/g, ''),
        dateFormater(year, month, day)
      );
      goto('smscode');
    } catch (e) {
      if (e.problem && e.problem.code === '10009') {
        showNotMemberNotification();
      } else if (e.problem && e.problem.code === '10031') {
        goto('acceptform');
      } else {
        showSomethingWrongNotification();
      }
    }
  } else {
    if (!document.getElementsByClassName('topNotification').length) {
      showNotCorrectFormNotification();
    }
  }
};
const signInMobileHandler = () => {
  const desktopImage = document.getElementsByClassName('desktopImage')[0];
  desktopImage.classList.add('mobileClosed');
  document.getElementsByClassName('firstStep')[0].style.display = 'none';
  document.getElementsByClassName('secondStep')[0].style.display = 'flex';
  document.getElementById('phone').focus();
};
const signInMobileRestart = () => {
  const desktopImage = document.getElementsByClassName('desktopImage')[0];
  desktopImage.classList.remove('mobileClosed');
  document.getElementsByClassName('firstStep')[0].style.display = '';
  document.getElementsByClassName('secondStep')[0].style.display = '';
};

const signInStart = () => {
  signInMobileRestart();
  const phone = document.getElementById('phone');
  restartSelects();
  isRegister = false;
  phone.value = '';
  document
    .getElementById('signInButton')
    .addEventListener('click', signInAction);

  if (phone.offsetWidth) {
    setTimeout(() => {
      phone.select();
      phone.focus();
    }, 600);
  }
  logOpenForm('SignInWebForm(Clone)');
  document
    .getElementById('firstStep')
    .addEventListener('click', signInMobileHandler);
};
const signInEnd = () => {
  document
    .getElementById('signInButton')
    .removeEventListener('click', signInAction);
  document
    .getElementById('firstStep')
    .removeEventListener('click', signInMobileHandler);
  logCloseForm('SignInWebForm(Clone)');
};

// Accept Page
const terms = document.getElementById('terms');
const regulations = document.getElementById('regulations');
const register = document.getElementById('register');

const accpetFormStart = () => {
  logMetrica('AuthForm')
  logOpenForm('SignInCheckForm(Clone)')
  isRegister = true;
};

register.addEventListener('click', async () => {
  if (terms.checked && regulations.checked) {
    const day = document.getElementById('day').value;
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;
    try {
      await Api.regStepOne(
        userNumber.replaceAll(/[ \(\)+-]/g, ''),
        dateFormater(year, month, day)
      );
      goto('smscode');
    } catch (e) {
      if (e.problem && e.problem.code === '10911') {
        showBlockedNotification();
      } else {
        showSomethingWrongNotification();
      }
    }
  }
  else {
    showNeedConsentNotification();
  }
});

// Sms Page
let retrySMSCooldown = 0;

const setTextRetrySMS = (sec) =>
  (document.getElementById('retrySMS').innerHTML = `Повторное SMS через: ${
    sec < 10 ? `0${sec}` : sec
  }`);

let interval;
const retrySMSHandler = async (_, withoutSend = false) => {
  if (retrySMSCooldown) return;

  const request = isRegister ? Api.regStepOne : Api.authStepOne;

  retrySMSCooldown = 60;
  const day = document.getElementById('day').value;
  const month = document.getElementById('month').value;
  const year = document.getElementById('year').value;
  const retrySms = document.getElementById('retrySMS');

  setTextRetrySMS(retrySMSCooldown);

  if (!withoutSend) {
    request(
      userNumber.replaceAll(/[ \(\)+-]/g, ''),
      dateFormater(year, month, day)
    );
    showRetrySMSNotification();
  }
  retrySms.classList.remove('underline');
  clearInterval(interval);
  interval = setInterval(() => {
    retrySMSCooldown--;
    setTextRetrySMS(retrySMSCooldown);

    if (!retrySMSCooldown) {
      clearInterval(interval);
      retrySms.innerHTML = 'Отправить код по SMS повторно';
      retrySms.classList.add('underline');
    }
  }, 1000);
};

const smsPageStart = () => {
  document
    .getElementById('retrySMS')
    .addEventListener('click', retrySMSHandler);
  document.getElementById(
    'smsPhoneNumber'
  ).innerHTML = `Код отправлен на ${userNumber}`;
  retrySMSCooldown = 0;
  retrySMSHandler(null, true);

  const smsCodeList = document.getElementsByClassName('inputField__smsInput');

  for (let i = 0; i < smsCodeList.length; i++) {
    smsCodeList[i].value = '';
  }

  logOpenForm('SignInWebSmsForm(Clone)');
  logMetrica('EnterCode');
  setTimeout(() => {
    const sms = document.getElementById('sms1')
    sms.focus()
    sms.setSelectionRange(0, 0)
  }, 500)

};
const smsPageEnd = () => {
  document
    .getElementById('retrySMS')
    .removeEventListener('click', retrySMSHandler);
  logCloseForm('SignInWebSmsForm(Clone)');
};

// Animation
let currentPage;

const pages = [
  {
    id: 'signin',
    startCallback: signInStart,
    endCallback: signInEnd,
  },
  {
    id: 'acceptform',
    startCallback: accpetFormStart,
    endCallback: () => {
      logCloseForm('SignInCheckForm(Clone)')
    },
  },
  {
    id: 'smscode',
    startCallback: smsPageStart,
    endCallback: smsPageEnd,
  },
  {
    id: 'game',
    startCallback: () => {
      if (window.UNITY) return;
      window.loadUnity && window.loadUnity();
    },
    endCallback: () => {},
  },
];

const goto = (name) => {
  const nextPageInfo = pages.find((el) => el.id === name);
  const page = document.getElementById(nextPageInfo.id);
  const prevPage = document.getElementById(
    (currentPage && currentPage.id) || ''
  );
  if (prevPage && prevPage.id === name) {
    currentPage.endCallback();
    nextPageInfo.startCallback();
    return;
  }

  page.style.display = '';
  if (prevPage) {
    prevPage.style.display = 'none';
    currentPage.endCallback();
  }

  nextPageInfo.startCallback();

  currentPage = nextPageInfo;
};

const RestartAuth = () => {
  goto('signin');
};
generateYears();


const startFunc = () => {
  const params = window
  .location
  .search
  .replace('?','')
  .split('&')
  .reduce(
    function(p,e){
      var a = e.split('=');
      p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
      return p;
    },
    {}
  );
  const cookie = document.cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});

  if (params['frontId'] || params['ow_id'] || params['Gmp-Playertoken'] || cookie['Gmp-Playertoken']) {
    goto('game');
  }
  else {
    goto('signin');
  }
}
startFunc()





const unitycanvas = document.querySelector("#unity-canvas");
const gltest = unitycanvas.getContext('webgl2');
if (!gltest) {
  goto('game');
}
else {
  const wasmSupported = (() => {
    try {
      if (
        typeof WebAssembly === 'object' &&
        typeof WebAssembly.instantiate === 'function'
      ) {
        const module = new WebAssembly.Module(
          Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
        );
        if (module instanceof WebAssembly.Module)
          return (
            new WebAssembly.Instance(module) instanceof WebAssembly.Instance
          );
      }
    } catch (e) {}
    return false;
  })();

  if (!wasmSupported) {
    goto('game');
    notSupportedWasm.style.display = 'block'
  };
}


let pagePosition = window.scrollY;
document.body.classList.add('disable-scroll');
document.body.dataset.position = pagePosition;
document.body.style.top = -pagePosition + 'px';

window.unityLoadComplete = () => {
  UnityApi.completeUnity();
}

window.addEventListener("error", () => {
  showSomethingWrongRefreshNotification();
});

Api.fetchIp();
