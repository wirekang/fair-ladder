import { ANIM_FACTOR } from "./const";
import { DBSchema } from "./db";

export function getLatestRound(v: DBSchema) {
  return v.round[getLatestRoundKey(v)];
}

export function getLatestRoundKey(v: DBSchema) {
  const keys = Object.keys(v.round);
  const key = keys.sort((a, b) => Number(b) - Number(a))[0];
  return Number(key);
}

export function getLatestRoundTitle(v: DBSchema) {
  const key = getLatestRoundKey(v);
  if (!key) {
    return "Loading... 이게 보이면 새로고침하세요";
  }

  return new Date(Number(key)).toLocaleString();
}

export function getMyOptions(v: DBSchema, userName: string) {
  try {
    return getLatestRound(v).user[userName].options.split(",");
  } catch {
    return [];
  }
}

export function getUsers(v: DBSchema): string[] {
  try {
    const round = getLatestRound(v);
    return Object.keys(round.user).map((user) => {
      return user;
    });
  } catch {
    return [];
  }
}

export function getOptions(v: DBSchema): string[] {
  try {
    const round = getLatestRound(v);
    return Object.keys(round.user).flatMap((user) => {
      return round.user[user].options.split(",");
    });
  } catch {
    return [];
  }
}

export function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export async function sleep(n: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, n / ANIM_FACTOR);
  });
}
