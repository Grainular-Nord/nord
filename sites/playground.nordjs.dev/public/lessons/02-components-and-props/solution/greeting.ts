import { html, type PureComponent } from '@grainular/nord';

type GreetingProps = { name: string; punctuation?: string };

export const Greeting: PureComponent<GreetingProps> = ({ name, punctuation = '!' }) => html`
    <h1>Hej, ${name}${punctuation}</h1>
`;
