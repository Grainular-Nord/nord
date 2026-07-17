import { mount } from '@grainular/nord';
import { Greeting } from './greeting.ts';

mount(() => Greeting({ name: 'Nørd' }), { to: document.querySelector('#app') });
