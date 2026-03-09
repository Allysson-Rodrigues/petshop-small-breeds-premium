import { beforeEach, describe, expect, it, vi } from "vitest";
import { InvalidCredentialsError } from "../errors/auth-errors.js";
import type { UserRepository } from "../repositories/user.repository.js";
import type { Encrypter } from "../services/encrypter.js";
import type { Hasher } from "../services/hasher.js";
import { LoginUseCase } from "./login.use-case.js";

const mockUser = {
	id: "user-1",
	name: "John Doe",
	email: "john@test.com",
	password: "hashed-password",
	role: "client",
	createdAt: new Date(),
};

function makeStubs() {
	const userRepository: UserRepository = {
		findAll: vi.fn(),
		findClients: vi.fn(),
		countClients: vi.fn(),
		create: vi.fn(),
		findByEmail: vi.fn(),
		findById: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	};
	const hasher: Hasher = {
		hash: vi.fn(),
		compare: vi.fn(),
	};
	const encrypter: Encrypter = {
		encrypt: vi.fn(),
		decrypt: vi.fn(),
	};
	return { userRepository, hasher, encrypter };
}

describe("LoginUseCase", () => {
	let sut: LoginUseCase;
	let stubs: ReturnType<typeof makeStubs>;

	beforeEach(() => {
		stubs = makeStubs();
		sut = new LoginUseCase(stubs.userRepository, stubs.hasher, stubs.encrypter);
	});

	it("should return token and user on valid credentials", async () => {
		vi.mocked(stubs.userRepository.findByEmail).mockResolvedValue(mockUser);
		vi.mocked(stubs.hasher.compare).mockResolvedValue(true);
		vi.mocked(stubs.encrypter.encrypt).mockResolvedValue("jwt-token-123");

		const result = await sut.execute({
			email: "john@test.com",
			password: "123456",
		});

		expect(result.token).toBe("jwt-token-123");
		expect(result.user.id).toBe("user-1");
		expect(result.user.email).toBe("john@test.com");
		expect(result.user.name).toBe("John Doe");
	});

	it("should normalize email (trim + lowercase)", async () => {
		vi.mocked(stubs.userRepository.findByEmail).mockResolvedValue(mockUser);
		vi.mocked(stubs.hasher.compare).mockResolvedValue(true);
		vi.mocked(stubs.encrypter.encrypt).mockResolvedValue("token");

		await sut.execute({ email: "  JOHN@TEST.COM  ", password: "123456" });

		expect(stubs.userRepository.findByEmail).toHaveBeenCalledWith(
			"john@test.com",
		);
	});

	it("should throw InvalidCredentialsError when user not found", async () => {
		vi.mocked(stubs.userRepository.findByEmail).mockResolvedValue(null);

		await expect(
			sut.execute({ email: "nobody@test.com", password: "123456" }),
		).rejects.toThrow(InvalidCredentialsError);
	});

	it("should throw InvalidCredentialsError when password is wrong", async () => {
		vi.mocked(stubs.userRepository.findByEmail).mockResolvedValue(mockUser);
		vi.mocked(stubs.hasher.compare).mockResolvedValue(false);

		await expect(
			sut.execute({ email: "john@test.com", password: "wrong" }),
		).rejects.toThrow(InvalidCredentialsError);
	});
});
