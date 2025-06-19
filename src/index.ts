import { ed25519, edwardsToMontgomeryPriv, edwardsToMontgomeryPub } from '@noble/curves/ed25519'
import { bytesToHex, hexToBytes, randomBytes } from '@noble/curves/utils'

export type Keypair = {
  x25519: SodiumKeypair
  ed25519: SodiumKeypair
}

export interface SodiumKeypair {
  privateKey: Uint8Array
  publicKey: Uint8Array
  keyType: string
}

/**
 * Generate Ed25519 keypair from "seed"
 * @param seed Seed value
 * @param includePublicKey Include public key to secret key value (like libsodium)
 */
const keyPairFromSeed = (seed: Uint8Array, includePublicKey = true): SodiumKeypair => {
  let pk = ed25519.getPublicKey(seed)
  let sk = new Uint8Array(includePublicKey ? 64 : 32)
  sk.set(seed, 0)
  if (includePublicKey) {
    sk.set(pk, 32)
  }
  
  return {
    keyType: "ed25519",
    privateKey: sk,
    publicKey: pk
  }
}

export function getKeypairFromSeed(seedHex: string): Keypair {
  const privKeyHexLength = 32 * 2
  if (seedHex.length !== privKeyHexLength) {
    seedHex = seedHex.concat('0'.repeat(32))
    seedHex = seedHex.substring(0, privKeyHexLength)
  }
  const seed = hexToBytes(seedHex)
  const ed25519KeyPair = keyPairFromSeed(seed)
  const x25519PublicKey = edwardsToMontgomeryPub(ed25519KeyPair.publicKey)

  const origPub = new Uint8Array(x25519PublicKey)
  const prependedX25519PublicKey = new Uint8Array(33)
  prependedX25519PublicKey.set(origPub, 1)
  prependedX25519PublicKey[0] = 5
  const x25519SecretKey = edwardsToMontgomeryPriv(ed25519KeyPair.privateKey)

  const x25519KeyPair: SodiumKeypair = {
    keyType: 'x25519',
    publicKey: prependedX25519PublicKey,
    privateKey: x25519SecretKey,
  }

  return { x25519: x25519KeyPair, ed25519: ed25519KeyPair }
}

export function generateSeedHex() {
  return bytesToHex(randomBytes(16))
}