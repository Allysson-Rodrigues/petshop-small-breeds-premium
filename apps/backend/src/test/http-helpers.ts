import request from "supertest";
import app from "../app.js";

export const loginAs = async (email: string, password: string) => {
	const response = await request(app).post("/api/auth/login").send({
		email,
		password,
	});

	const setCookieHeader = response.headers["set-cookie"];

	if (response.statusCode !== 200 || !setCookieHeader) {
		throw new Error(`Unable to login test user ${email}`);
	}

	return Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
};

export const loginAsAdmin = async () =>
	loginAs("admin@petshop.com", "admin123");
export const loginAsClient = async () =>
	loginAs("cliente@petshop.com", "cliente123");
export const loginAsSecondClient = async () =>
	loginAs("cliente2@petshop.com", "cliente456");
