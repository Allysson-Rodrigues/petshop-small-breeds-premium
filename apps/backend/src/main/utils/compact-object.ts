type CompactObject<T extends object> = {
	[K in keyof T]?: Exclude<T[K], undefined>;
};

export const compactObject = <T extends object>(value: T) => {
	return Object.fromEntries(
		Object.entries(value).filter(([, item]) => item !== undefined),
	) as CompactObject<T>;
};
