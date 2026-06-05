export type NavigateOptions = string | ({ path: string } & NavigationNavigateOptions);

export const navigate = (destination: NavigateOptions) => {
    navigation.navigate(
        typeof destination === 'string' ? destination : destination.path,
        typeof destination === 'string' ? {} : (destination ?? {}),
    );
};
