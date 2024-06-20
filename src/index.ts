import sodium from 'libsodium-wrappers-sumo'

export type Keypair = {
  x25519: sodium.KeyPair
  ed25519: sodium.KeyPair
}

export function getKeypairFromSeed(seedHex: string): Keypair {
  const privKeyHexLength = 32 * 2
  if (seedHex.length !== privKeyHexLength) {
    seedHex = seedHex.concat('0'.repeat(32))
    seedHex = seedHex.substring(0, privKeyHexLength)
  }
  const seed = hexToUint8Array(seedHex)
  const ed25519KeyPair = sodium.crypto_sign_seed_keypair(new Uint8Array(seed))
  const x25519PublicKey = sodium.crypto_sign_ed25519_pk_to_curve25519(ed25519KeyPair.publicKey)
  const origPub = new Uint8Array(x25519PublicKey)
  const prependedX25519PublicKey = new Uint8Array(33)
  prependedX25519PublicKey.set(origPub, 1)
  prependedX25519PublicKey[0] = 5
  const x25519SecretKey = sodium.crypto_sign_ed25519_sk_to_curve25519(ed25519KeyPair.privateKey)

  const x25519KeyPair: sodium.KeyPair = {
    keyType: 'x25519',
    publicKey: prependedX25519PublicKey,
    privateKey: x25519SecretKey,
  }

  return { x25519: x25519KeyPair, ed25519: ed25519KeyPair }
}

export function generateSeedHex() {
  const seed = sodium.randombytes_buf(16, 'hex')
}

// 👇 Credit: https://stackoverflow.com/a/69585881 👇

const MAP_HEX: { [k: string]: number } = {
  0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6,
  7: 7, 8: 8, 9: 9, a: 10, b: 11, c: 12, d: 13,
  e: 14, f: 15, A: 10, B: 11, C: 12, D: 13,
  E: 14, F: 15
}

function hexToUint8Array(hexString: string) {
  const bytes = new Uint8Array(Math.floor((hexString || '').length / 2))
  let i
  for (i = 0; i < bytes.length; i++) {
    const a = MAP_HEX[hexString[i * 2]]
    const b = MAP_HEX[hexString[i * 2 + 1]]
    if (a === undefined || b === undefined) {
      break
    }
    bytes[i] = (a << 4) | b
  }
  return i === bytes.length ? bytes : bytes.slice(0, i)
}

// 👆 Credit: https://stackoverflow.com/a/69585881 👆