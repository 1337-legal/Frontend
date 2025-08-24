import Fortress from '@blindflare/Fortress';

import SessionService from './SessionService';

// ---------------- Types & Guards ----------------
export type Body = Record<string, unknown>;
export interface AliasRecord { id?: string; alias?: string; address?: string; createdAt?: string;[k: string]: unknown }

interface BlindflareMeta { type: string; version: string }
interface EncryptedEnvelope { blindflare: BlindflareMeta; cipher: string; iv?: string;[k: string]: unknown }
interface ServerHello { serverPub?: string; sessionKeyEnc?: { data: string; iv: string; tag: string; ephemeralPublicKey: string };[k: string]: unknown }

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const isEncryptedEnvelope = (v: unknown): v is EncryptedEnvelope => isObject(v) && 'blindflare' in v && 'cipher' in v;
const hasToken = (v: unknown): v is { token: string } => isObject(v) && 'token' in v && typeof v.token === 'string';
const unwrapPayload = <T,>(v: unknown): T | unknown => (isObject(v) && 'payload' in v) ? (v as { payload: T }).payload : v;

class BackendService {
    domain = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');

    private mnemonicKey = 'bf_mnemonic';
    private privateKey: string | null = null;
    private publicKey: string | null = null;
    private token: string | null = null;
    private sessionKey: string | null = null;
    private serverPublicKey: string | null = null; // new
    private helloDone = false;
    private initializing: Promise<void> | null = null;

    // --------------- Public API ---------------
    async initWithMnemonic(mnemonic: string) {
        localStorage.setItem(this.mnemonicKey, mnemonic.trim());
        this.resetAuth();
        await this.ensureSession();
    }
    getToken() { return this.token; }

    // --------------- Key Derivation ---------------
    private async derivePrivateKeyFromMnemonic(m: string): Promise<string> {
        const enc = new TextEncoder().encode(m.normalize('NFKD'));
        const hash = await crypto.subtle.digest('SHA-256', enc);
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 64);
    }
    private async ensureKeyPair() {
        if (this.privateKey && this.publicKey) return;
        let mnemonic = localStorage.getItem(this.mnemonicKey);
        if (!mnemonic) {
            mnemonic = 'bullet all surprise birth layer another thought skin extra hurdle now card'; // fallback
            localStorage.setItem(this.mnemonicKey, mnemonic);
        }
        this.privateKey = await this.derivePrivateKeyFromMnemonic(mnemonic);
        const { ec } = await import('elliptic');
        const curve = new ec('secp256k1');
        const key = curve.keyFromPrivate(this.privateKey, 'hex');
        this.publicKey = key.getPublic('hex');
    }
    private async sign(data: string): Promise<string> {
        if (!this.privateKey) throw new Error('Private key not initialized');
        return await Fortress.signData(data, this.privateKey);
    }

    // --------------- Handshakes ---------------
    private async hello() {
        if (this.helloDone && this.sessionKey) return;
        if (!this.publicKey || !this.privateKey) throw new Error('Public key missing');
        const ver = '1';
        const ts = Date.now();
        const nonce = crypto.getRandomValues(new Uint8Array(12)).reduce((a, b) => a + b.toString(16).padStart(2, '0'), '');
        const payload = `HELLO|${ver}|${ts}|${nonce}|${this.publicKey}`;
        const signature = await this.sign(payload);
        const body = { blindflare: { type: 'HELLO', ver, publicKey: this.publicKey, nonce, ts, caps: { enc: ['aes-256-gcm'], ecc: ['secp256k1'], ser: ['json'] }, signature } };
        const res = await fetch(`${this.domain}/api/v1/blindflare/hello`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error('HELLO failed');
        const data = await res.json();
        try {
            const serverHelloRaw = data?.blindflare as unknown;
            if (isObject(serverHelloRaw)) {
                const serverHello = serverHelloRaw as ServerHello;
                if (typeof serverHello.serverPub === 'string') this.serverPublicKey = serverHello.serverPub;
                const enc = serverHello.sessionKeyEnc;
                if (enc && typeof enc === 'object') {
                    try {
                        console.log("enc", enc)
                        console.log("this.privateKey!", this.privateKey!)
                        const plaintext = await Fortress.decryptWithECC(enc, this.privateKey!);
                        const parsed = JSON.parse(plaintext);
                        if (parsed.key && typeof parsed.key === 'string') {
                            this.sessionKey = parsed.key;
                            localStorage.setItem('bf_session_key', this.sessionKey!);
                        }
                    } catch (e) {
                        console.warn('[Blindflare] Failed to decrypt sessionKeyEnc', e);
                    }
                }
            }
        } catch (e) {
            console.warn('[Blindflare] HELLO parse error', e);
        }
        if (!this.sessionKey) throw new Error('Session key negotiation failed');
        this.helloDone = true;
    }

    private async auth() {
        if (this.token) return;
        if (!this.publicKey) throw new Error('Public key missing');
        const signature = await this.sign('AUTH');
        const body = { blindflare: { type: 'AUTH', publicKey: this.publicKey, signature, version: Fortress.version } };
        const res = await fetch(`${this.domain}/api/v1/auth`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'BF-Session-Key': await this.resealSessionKeyForServer() }, body: JSON.stringify(body) });
        const raw = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error('Auth failed');
        if (!hasToken(raw)) throw new Error('Auth failed: no token');
        this.token = raw.token; localStorage.setItem('token', this.token); SessionService.setToken(this.token);
    }

    private async ensureSession() {
        if (this.token && this.helloDone) return;
        if (this.initializing) { await this.initializing; return; }
        this.initializing = (async () => {
            await this.ensureKeyPair();
            await this.hello();
            await this.auth();
        })();
        try { await this.initializing; } finally { this.initializing = null; }
    }

    private resetAuth() {
        this.token = null;
        this.sessionKey = null;
        this.helloDone = false;
        this.privateKey = null;
        this.publicKey = null;
        localStorage.removeItem('token');
        localStorage.removeItem('bf_session_key');
    }

    // --------------- Generic Request ---------------
    async sendRequest(method: string, endpoint: string, body?: Body): Promise<{ response: Response; status: number; data: unknown }> {
        await this.ensureSession();
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
        if (this.sessionKey) headers['BF-Session-Key'] = await this.resealSessionKeyForServer();

        let outbound: string | undefined;
        if (method !== 'GET') {
            if (!this.sessionKey) throw new Error('Missing session key');
            const meta = { type: 'TX', version: Fortress.version };
            const envelope = Fortress.encryptTransaction?.({ payload: body }, this.sessionKey, meta) || { blindflare: meta, payload: body };
            outbound = JSON.stringify(envelope);
        }

        const response = await fetch(this.domain + endpoint, { method, headers, body: outbound });
        if (response.status === 401) { this.resetAuth(); window.location.href = '/auth'; }

        let parsed: unknown = null; try { parsed = await response.json(); } catch { /* ignore */ }
        if (parsed && this.sessionKey && isEncryptedEnvelope(parsed)) {
            try {
                const decrypted = Fortress.decryptTransaction(parsed, this.sessionKey) || parsed;
                parsed = unwrapPayload(decrypted);
            } catch { /* ignore */ }
        } else parsed = unwrapPayload(parsed);

        return { response, status: response.status, data: parsed };
    }

    // --------------- Alias Helpers ---------------
    async listAliases(): Promise<AliasRecord[]> {
        const { data } = await this.sendRequest('GET', '/api/v1/alias');
        return Array.isArray(data) ? data as AliasRecord[] : [];
    }
    async createAlias(): Promise<AliasRecord> {
        const { data, status } = await this.sendRequest('PUT', '/api/v1/alias', {});
        if (status >= 400) throw new Error('Alias create failed');
        return data as AliasRecord;
    }
    async deleteAlias(record: AliasRecord): Promise<void> {
        if (record.id) { await this.sendRequest('DELETE', `/api/v1/alias/${record.id}`); return; }
        const alias = record.alias || record.address; if (alias) await this.sendRequest('DELETE', '/api/v1/alias', { alias });
    }

    private async resealSessionKeyForServer(): Promise<string> {
        if (!this.sessionKey) {
            const stored = localStorage.getItem('bf_session_key');
            if (stored) this.sessionKey = stored;
        }
        if (!this.sessionKey) {
            console.warn('[Blindflare] Cannot seal session key: sessionKey missing');
            return '';
        }
        const targetPub = this.serverPublicKey || this.publicKey;
        if (!targetPub) {
            console.warn('[Blindflare] Cannot seal session key: server public key unknown');
            return '';
        }
        try {
            return Fortress.wrapSessionKey ? await Fortress.wrapSessionKey(targetPub, this.sessionKey) : '';
        } catch (e) {
            console.warn('[Blindflare] wrapSessionKey failed', e);
            return '';
        }
    }
}

export default new BackendService();