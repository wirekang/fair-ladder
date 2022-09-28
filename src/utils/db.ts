import { get, onValue, ref, remove, set } from "firebase/database";
import { MAX_OPTION } from "./const";
import { getLatestRoundKey } from "./data";
import { firebaseDatabase } from "./firebase";

export interface DBSchema {
  round: Record<number, Round>;
}

export interface Round {
  user: Record<string, User>;
}

export interface User {
  options: string;
}

export async function createRound() {
  const bkup = listeners;
  listeners = [];
  await remove(ref(firebaseDatabase));
  listeners = bkup;
  const key = Date.now();
  await set(ref(firebaseDatabase, `round/${key}`), "");
  return key;
}

const rootRef = ref(firebaseDatabase);
let listeners: ((v: DBSchema) => void)[] = [];
onValue(rootRef, (snapshop) => {
  listeners.forEach((v) => {
    v(snapshop.val());
  });
});

export function addDataListener(v: (v: DBSchema) => void) {
  listeners.push(v);
  get(rootRef);
}

export function removeDataListener(f: any) {
  listeners = listeners.filter((v) => v !== f);
}

export function isAdmin(): boolean {
  return localStorage.getItem("protein") === "asdf";
}

export function setOptions(v: DBSchema, userName: string, options: string) {
  options = options.split(",").splice(0, MAX_OPTION).join(",");
  const key = getLatestRoundKey(v);
  set(ref(firebaseDatabase, `round/${key}/user/${userName}/options`), options);
}
