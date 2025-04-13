export { createDirective } from './directives/create-directive'
export { on } from './directives/on'
import { derived, grain } from '@grainular/grains'
import { mount } from './application/mount'
import { templateParser as html } from './component/template-parser'
import { on } from './directives/on'

const count = grain(0)
const disabled = derived(count, (count) => count > 10)
mount(() => html`<button disabled="${disabled}" ${on('click', () => count.set(count() + 1))}>${count}</button>`, {
    to: document.querySelector('body'),
})
