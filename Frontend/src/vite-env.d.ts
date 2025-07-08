
interface ImportMetaEnv {
    readonly VITE_API_KEY_HEADER_NAME: string;
    readonly VITE_API_KEY_VALUE: string;
    readonly VITE_API_URL: string;
    readonly VITE_API_USER_APP_STATE_NAME: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}