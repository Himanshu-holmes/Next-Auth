import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { data: session } = useSession();

  if (session) {
    console.log("session,", session);
    return (
      <>
        Signed in as <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-[100vh]">
      <form onSubmit={handleSubmit} className={"flex flex-col"}>
        <label>Email</label>
        <input
          className="text-black"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          className="text-black"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p>{error}</p>}
        <button className="p-2 mt-3 bg-blue-500 rounded-md" type="submit">
          Sign In
        </button>
        <button className="p-2 mt-3 bg-red-500 rounded-md" onClick={()=>{
          signIn("google")
        }}>
          Sign In With Google
        </button>
      </form>
    </div>
  );
}
