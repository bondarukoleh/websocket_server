$(function () {
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  const $window = $(window);
  const $usernameInput = $('.usernameInput');
  const $messages = $('.messages');
  const $inputMessage = $('.inputMessage');

  const $loginPage = $('.login.page');
  const $chatPage = $('.chat.page');

  let username;
  let connected = false;
  let $currentInput = $usernameInput.focus();
  let userColor;

  const socket = io();

  const setUsername = () => {
    username = cleanInput($usernameInput.val().trim());
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();
      socket.emit('add user', username);
    }
  }

  $window.keydown(e => {
    if (!e.metaKey) {
      $currentInput.focus()
    }
    if (e.which === 13) {
      if (username) {
        sendMessage()
      } else {
        setUsername()
      }
    }
  })

  const sendMessage = () => {
    let message = $inputMessage.val();
    message = cleanInput(message);
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message,
        color: userColor
      });
      socket.emit('new message', {
        username: username,
        message: message,
        color: userColor
      });
    }
  }

  const addChatMessage = (data) => {
    const $usernameDiv = $('<span class="userName" />')
    .text(data.username + ': ').css('color', data.color)
    const $userMessage = $('<span class="userMessageBody">')
    .text(data.message)
    const $message = $('<li class="message"/>').data('username', data.username)
    .append($usernameDiv, $userMessage);
    addMessageElement($message)
  }

  const cleanInput = (input) => {
    return $('<div/>').text(input).html();
  }

  const log = (message, options) => {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  const addMessageElement = (el, opt) => {
    var $el = $(el);
    $messages.append($el);
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  socket.on('login', (name) => {
    connected = true;
    userColor = COLORS[Math.floor(Math.random() * 12)];
    var message = `${name}! Welcome to our cool socket chat!`;
    log(message);
  });

  socket.on('new user', (name) => {
    var message = `We got new guy here – ${name}`;
    log(message);
  });

  socket.on('new message', (data) => {
    addChatMessage(data);
  });

  socket.on('disconnect', () => {
    log('Sorry, server is down. Nothing you can do about it');
  })

  socket.on('user left', name => {
    log(name + ' has left :('); 
  })
})

