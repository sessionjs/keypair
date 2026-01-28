# @session.js/keypair

Session messenger & Session.js keypairs utilities.

## type SessionKeys

SessionKeys is two KeyPairs: x25519 (curve25519) and ed25519

```ts
type SessionKeys = {
  x25519: KeyPair
  ed25519: KeyPair
}
```

Session ID consists of x25519's public key prepended with `05`.

Ed25519 keypairs are used mainly for messages encryption.

## getKeysFromSeed

Converts seed hex to Session keys (x25519 & ed25519 keypairs):

```ts
import { getKeysFromSeed } from '@session.js/keypair'

const keys = getKeysFromSeed('39038c8988db02c1af44e8c847bd9713')
console.log(keys.x25519.publicKey) // => 0548054830367d369d94605247999a375dbd0a0f65fdec5de1535612bcb6d4de452c69
```

## generateSeedHex

Generates random seed and converts it to hex. Under the hood it uses CSPRNG from `@noble/curves`.

```ts
import { generateSeedHex } from '@session.js/keypair'

const seed = await generateSeedHex()
console.log(seed) // => 39038c8988db02c1af44e8c847bd9713
```

## Made for session.js

Use Session messenger programmatically with [Session.js](https://github.com/sessionjs/client): Session bots, custom Session clients, and more.

## Donate

[hloth.dev/donate](https://hloth.dev/donate)