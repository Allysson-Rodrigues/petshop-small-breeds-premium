import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { InputValidationError } from "../../domain/errors/app-error.js";

const flattenValidationErrors = (
	fieldErrors: Record<string, string[] | undefined>,
	formErrors: string[],
): Record<string, string[]> => {
	const normalized = Object.fromEntries(
		Object.entries(fieldErrors).filter(
			([, value]) => value && value.length > 0,
		),
	) as Record<string, string[]>;

	if (formErrors.length > 0) {
		normalized._form = formErrors;
	}

	return normalized;
};

export const validateBody = (schema: ZodTypeAny) => {
	return (req: Request, _res: Response, next: NextFunction) => {
		const parsed = schema.safeParse(req.body);
		if (!parsed.success) {
			const flattened = parsed.error.flatten();
			return next(
				new InputValidationError(
					"Validation error",
					flattenValidationErrors(flattened.fieldErrors, flattened.formErrors),
				),
			);
		}

		req.body = parsed.data;
		return next();
	};
};
