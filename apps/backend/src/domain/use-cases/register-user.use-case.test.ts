import { beforeEach, describe, expect, it, vi } from "vitest";
import { InputValidationError } from "../errors/app-error.js";
import { DuplicateEmailError } from "../errors/auth-errors.js";
import type { UserRepository } from "../repositories/user.repository.js";
import type { Hasher } from "../services/hasher.js";
import { RegisterUserUseCase } from "./register-user.use-case.js";

const existingUser = {
	id: "user-1",
	name: "Existing",
	email: "existing@test.com",
	password: "hashed",
	role: "client",
	createdAt: new Date(),
};

function makeStubs() {
	const userRepository: UserRepository = {
		findAll: vi.fn(),
		create: vi.fn().mockImplementation(async (data) => ({
			id: "new-user-id",
			...data,
			createdAt: new Date(),
		})),
		findByEmail: vi.fn(),
		findById: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	};
	const hasher: Hasher = {
		hash: vi.fn().mockResolvedValue("hashed-password"),
		compare: vi.fn(),
	};
	return { userRepository, hasher };
}

describe("RegisterUserUseCase", () => {
	let sut: RegisterUserUseCase;
	let stubs: ReturnType<typeof makeStubs>;

	beforeEach(() => {
		stubs = makeStubs();
		sut = new RegisterUserUseCase(stubs.userRepository, stubs.hasher);
	});

	it("should create a new user with hashed password", async () => {
		vi.mocked(stubs.userRepository.findByEmail).mockResolvedValue(null);

		const result = await sut.execute({
			name: "Maria Silva",
			email: "maria@test.com",
			password: "senha123",
		});

		expect(result.id).toBe("new-user-id");
		expect(result.email).toBe("maria@test.com");
		expect(result.password).toBe("hashed-password");
		expect(result.role).toBe("client");
		expect(stubs.hasher.hash).toHaveBeenCalledWith("senha123");
	});

	it("should normalize email (trim + lowercase)", async () => {
		vi.mocked(stubs.userRepository.findByEmail).mockResolvedValue(null);

		await sut.execute({
			name: "Test",
			email: "  MARIA@TEST.COM  ",
			password: "senha123",
		});

		expect(stubs.userRepository.findByEmail).toHaveBeenCalledWith(
			"maria@test.com",
		);
	});

	it("should throw DuplicateEmailError when email already exists", async () => {
		vi.mocked(stubs.userRepository.findByEmail).mockResolvedValue(existingUser);

		await expect(
			sut.execute({
				name: "New User",
				email: "existing@test.com",
				password: "senha123",
			}),
		).rejects.toThrow(DuplicateEmailError);
	});

	it("should throw InputValidationError for invalid name (too short)", async () => {
		await expect(
			sut.execute({ name: "A", email: "test@test.com", password: "senha123" }),
		).rejects.toThrow(InputValidationError);
	});

	it("should throw InputValidationError for invalid email", async () => {
		await expect(
			sut.execute({
				name: "Valid Name",
				email: "not-an-email",
				password: "senha123",
			}),
		).rejects.toThrow(InputValidationError);
	});

	it("should throw InputValidationError for short password (< 6 chars)", async () => {
		await expect(
			sut.execute({
				name: "Valid Name",
				email: "test@test.com",
				password: "12345",
			}),
		).rejects.toThrow(InputValidationError);
	});
});
