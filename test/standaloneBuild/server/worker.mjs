console.log("hello from child process");
import { hash } from "@node-rs/argon2";
import express from "express";
import { two } from "./shared-chunk.js";

const argon2Opts = {
  memory: 3145728,
  iterations: 2,
  parallelism: 64,
  salt_length: 16,
  key_length: 32,
};

(async () => {
  const hashed = await hash("password", argon2Opts);
  console.log("worker.mjs", { hashed });
})();

if (typeof express !== "function") {
  throw new Error("express is not a function")
}

if (typeof two !== "function") {
  throw new Error("two is not a function")
}

console.log('worker.mjs>shared-chunk', two())
