type Partial<T> = {
    [P in keyof T]?: T[P];
};

export { Partial };
