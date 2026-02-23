export interface Encrypter {
	encrypt(payload: any): Promise<string>;
	decrypt(token: string): Promise<any>;
}
