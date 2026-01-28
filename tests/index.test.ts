import { test, expect } from "bun:test"
import { getKeysFromSeed } from "../src"
import { bytesToHex } from "@noble/curves/utils.js"

test("Seed #1", () => {
    let keys = getKeysFromSeed("39038c8988db02c1af44e8c847bd9713")

    expect(bytesToHex(keys.x25519.publicKey)).toBe("054830367d369d94605247999a375dbd0a0f65fdec5de1535612bcb6d4de452c69")
    expect(bytesToHex(keys.x25519.privateKey)).toBe("38826f05b06ae13d8e9fa7ebc694410979339df07731e6300128dab10ccd9d7b")

    expect(bytesToHex(keys.ed25519.publicKey)).toBe("f661a69453ef81a3b75bfcf954eb1f439d4d74edcab0e72a5c435ee418a907be")
    expect(bytesToHex(keys.ed25519.privateKey)).toBe("39038c8988db02c1af44e8c847bd971300000000000000000000000000000000f661a69453ef81a3b75bfcf954eb1f439d4d74edcab0e72a5c435ee418a907be")
})

test("Seed #2", () => {
    let keys = getKeysFromSeed("8c0d6b3ad3d2d5c7c252d3816ba7f267")

    expect(bytesToHex(keys.x25519.publicKey)).toBe("05276137de3e4be913e0d30de7d59428446033a978893e788e91e4f2ddc02bd378")
    expect(bytesToHex(keys.x25519.privateKey)).toBe("e89642bff0068aa119183fc4bec493cb5173643a2c4ed01187953641c7f13f61")

    expect(bytesToHex(keys.ed25519.publicKey)).toBe("62267776b50f7a12376fb91647c296d8b9cd0b24743ec0b97f530b3907518ec3")
    expect(bytesToHex(keys.ed25519.privateKey)).toBe("8c0d6b3ad3d2d5c7c252d3816ba7f2670000000000000000000000000000000062267776b50f7a12376fb91647c296d8b9cd0b24743ec0b97f530b3907518ec3")
})
