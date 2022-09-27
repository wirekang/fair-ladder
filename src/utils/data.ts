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
    return "Loading...";
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

export function getUsers(v: DBSchema): [userName: string, options: string][] {
  try {
    const round = getLatestRound(v);
    return Object.keys(round.user).map((user) => {
      return [user, round.user[user].options];
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
