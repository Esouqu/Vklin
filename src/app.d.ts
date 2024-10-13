import 'unplugin-icons/types/svelte'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		__TAURI__: Record<string, unknown>;
	}

	declare module '*.glb' {
		const src: string;
		export default src;
	}

	declare module '*.fbx' {
		const src: string;
		export default src;
	}
}

export { };
