import { useUser } from '@clerk/nextjs';

export default function ProtectedPage() {
  const { user } = useUser();

  if (!user) {
    return <div>Loading...</div>; // Or redirect to sign-in
  }

  return <div>Protected Content for {user.firstName}</div>;
}
