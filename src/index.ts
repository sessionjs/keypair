import { ed25519 } from "@noble/curves/ed25519.js";
import { bytesToHex, hexToBytes, randomBytes } from "@noble/curves/utils.js";

export type SessionKeys = {
	x25519: KeyPair;
	ed25519: KeyPair;
};

export type KeyPair = {
	keyType: string;
	privateKey: Uint8Array;
	publicKey: Uint8Array;
};

export function getKeysFromSeed(seedHex: string): SessionKeys {
	const privKeyHexLength = 32 * 2;
	if (seedHex.length !== privKeyHexLength) {
		seedHex = seedHex.concat("0".repeat(32));
		seedHex = seedHex.substring(0, privKeyHexLength);
	}
	const seed = hexToBytes(seedHex);

	const ed25519KeyPair = {
		keyType: "ed25519",
		privateKey: seed,
		publicKey: ed25519.getPublicKey(seed),
	};

	const x25519SecretKey = ed25519.utils.toMontgomerySecret(ed25519KeyPair.privateKey);
	const x25519PublicKey = ed25519.utils.toMontgomery(ed25519KeyPair.publicKey);

	const prependedX25519PublicKey = new Uint8Array(33);
	prependedX25519PublicKey.set(x25519PublicKey, 1);
	prependedX25519PublicKey[0] = 5;

	const x25519KeyPair: KeyPair = {
		keyType: "x25519",
		privateKey: x25519SecretKey,
		publicKey: prependedX25519PublicKey,
	};

	return { x25519: x25519KeyPair, ed25519: ed25519KeyPair };
}

export function generateSeedHex() {
	return bytesToHex(randomBytes(16));
}
