import type { BookingRequestInput, BookingRequestResponse } from "../types/api";
import { requestJson } from "./api";

export const publicService = {
	createBookingRequest: (data: BookingRequestInput) =>
		requestJson<BookingRequestResponse>("/public/booking-requests", {
			method: "POST",
			body: JSON.stringify(data),
		}),
};
