import { html, type PureComponent } from '@grainular/nord';

type GreetingProps = { name: string; punctuation?: string };

// TODO: use `name` and `punctuation` in the template below.
// `punctuation` should default to "!" when the caller doesn't pass one.
export const Greeting: PureComponent<GreetingProps> = ({ name, punctuation }) => html`
    <h1>Hej!</h1>
`;
