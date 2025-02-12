import type { LogsCollection } from "$lib/interfaces";
import { writable } from "svelte/store";

const gameLogs = writable<LogsCollection | null>(null);

export default gameLogs;
