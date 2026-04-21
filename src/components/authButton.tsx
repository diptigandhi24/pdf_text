import { useAuth } from "../hooks/useAuth";

export default function AuthButton() {
  const { user, loading, loginWithGoogle, logout } = useAuth();

  if (loading) {
    return <span>Loading...</span>;
  }

  if (user) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {user.user_metadata.avatar_url && (
          <img
            src={user.user_metadata.avatar_url}
            alt="avatar"
            style={{ width: 32, height: 32, borderRadius: "50%" }}
          />
        )}
        <span>{user.user_metadata.full_name ?? user.email}</span>
        <button onClick={logout}>Sign out</button>
      </div>
    );
  }

  return <button onClick={loginWithGoogle}>Sign in with Google</button>;
}
