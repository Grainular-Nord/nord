export const setup = () => {
    document.body.replaceChildren(document.createElement('div'));
    document.body.firstElementChild?.setAttribute('id', 'app');
};
