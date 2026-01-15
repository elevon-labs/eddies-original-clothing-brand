import { initBotId } from 'botid/client/core';

initBotId({
  protect: [
    { path: '/api/contact', method: 'POST' },
    { path: '/api/newsletter/subscribe', method: 'POST' },
    { path: '/api/auth/signup', method: 'POST' },
    { path: '/api/orders', method: 'POST' },
  ],
});
