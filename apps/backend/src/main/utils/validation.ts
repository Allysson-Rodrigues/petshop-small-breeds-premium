import type { ZodType } from "zod";
import {
	type ErrorDetails,
	InputValidationError,
} from "../../domain/errors/app-error.js";

const flattenFieldErrors = (
	fieldErrors: Record<string, string[] | undefined>,
) => {
	return Object.fromEntries(
		Object.entries(fieldErrors).filter(([, messages]) => messages?.length),
	) as ErrorDetails;
};

export const parseSchema = <T>(schema: ZodType<T>, payload: unknown): T => {
	const parsed = schema.safeParse(payload);

	if (!parsed.success) {
		throw new InputValidationError(
			"Validation error",
			flattenFieldErrors(parsed.error.flatten().fieldErrors),
		);
	}

	return parsed.data;
};
