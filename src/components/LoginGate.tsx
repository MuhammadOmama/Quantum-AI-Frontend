import { FormEvent, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import {
  clearSession,
  getToken,
  loginAiAccount,
  registerAiAccount,
  setToken,
  setUserId,
} from '../api/client';

type AuthMode = 'signin' | 'signup';

type AuthSession = {
  logout: () => void;
};

const AuthSessionContext = createContext<AuthSession | null>(null);

export function useAuthSession() {
  const ctx = useContext(AuthSessionContext);
  if (!ctx) {
    throw new Error('useAuthSession must be used inside LoginGate');
  }
  return ctx;
}

export function LoginGate({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(Boolean(getToken()));
  const [mode, setMode] = useState<AuthMode>('signin');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onExpired = () => {
      clearSession();
      setAuthenticated(false);
      setError('Your session expired. Please sign in again.');
    };
    window.addEventListener('quantum-ai-auth-expired', onExpired);
    return () => window.removeEventListener('quantum-ai-auth-expired', onExpired);
  }, []);

  function logout() {
    clearSession();
    setAuthenticated(false);
    setPassword('');
    setConfirmPassword('');
    setError('');
  }

  if (authenticated) {
    return (
      <AuthSessionContext.Provider value={{ logout }}>{children}</AuthSessionContext.Provider>
    );
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters');
        }
        const data = await registerAiAccount({
          email,
          password,
          displayName: displayName.trim() || undefined,
        });
        setToken(data.token);
        setUserId(data.user.id);
      } else {
        const data = await loginAiAccount({ email, password });
        setToken(data.token);
        setUserId(data.user.id);
      }
      setAuthenticated(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  }

  function switchMode(next: AuthMode) {
    setMode(next);
    setError('');
    setConfirmPassword('');
  }

  return (
    <main className="ai-login-page">
      <section className="ai-login-copy">
        <img src="/logo.png" alt="" className="ai-login-logo" />
        <p className="ai-login-brand">QuantumAI</p>
        <h1>{mode === 'signup' ? 'Create your AI workspace.' : 'Your focused AI workspace.'}</h1>
        <p>
          {mode === 'signup'
            ? 'Sign up for a QuantumAI account — separate from QuantumChat. Chat, study documents, quizzes, and presentations in one place.'
            : 'Sign in with your QuantumAI account to chat, study documents, build quizzes, and generate lesson presentations.'}
        </p>
        <ul className="ai-auth-points">
          <li>Private AI conversations & documents</li>
          <li>Lesson plans, quizzes & presentations</li>
          <li>Independent from your messenger login</li>
        </ul>
      </section>

      <form className="ai-login-form" onSubmit={submit}>
        <div className="ai-auth-tabs" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signin'}
            className={mode === 'signin' ? 'active' : ''}
            onClick={() => switchMode('signin')}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => switchMode('signup')}
          >
            Create account
          </button>
        </div>

        {mode === 'signup' && (
          <label>
            Display name
            <input
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="How we should greet you"
              autoComplete="nickname"
              maxLength={80}
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={mode === 'signup' ? 8 : 1}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          />
        </label>

        {mode === 'signup' && (
          <label>
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>
        )}

        {error && <p className="error-banner">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting
            ? mode === 'signup'
              ? 'Creating account…'
              : 'Signing in…'
            : mode === 'signup'
              ? 'Create QuantumAI account'
              : 'Continue to QuantumAI'}
        </button>

        <p className="ai-auth-switch">
          {mode === 'signin' ? (
            <>
              New here?{' '}
              <button type="button" className="ai-auth-link" onClick={() => switchMode('signup')}>
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" className="ai-auth-link" onClick={() => switchMode('signin')}>
                Sign in
              </button>
            </>
          )}
        </p>
      </form>
    </main>
  );
}
