import type { ZodType } from "zod";
import {
	type ErrorDetails,
	InputValidationError,
} from "../../domain/errors/app-error.js";

const flattenFieldErrors = (
	fieldErrors: Record<string, string[] | undefined>,
	formErrors: string[],
) => {
	const details = Object.fromEntries(
		Object.entries(fieldErrors).filter(([, messages]) => messages?.length),
	) as ErrorDetails;

	if (formErrors.length > 0) {
		details._form = formErrors;
	}

	return details;
};

export const parseSchema = <T>(schema: ZodType<T>, payload: unknown): T => {
	const parsed = schema.safeParse(payload);

	if (!parsed.success) {
		const flattened = parsed.error.flatten();
		throw new InputValidationError(
			"Validation error",
			flattenFieldErrors(flattened.fieldErrors, flattened.formErrors),
		);
	}

	return parsed.data;
};
