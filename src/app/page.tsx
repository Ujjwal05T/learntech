import Link from "next/link";

export default function Home() {
  return (
    <>
    <div>
      Landing Page 
      <ul>
        <li>Little description about the project</li>
        <li>Login Button</li>
        <li>Register Button</li>
        <li>View roadmaps Button</li>
      </ul>
    </div>
    <div className="text-blue-600 mt-2 mx-2 space-x-2">
    <Link href="/home" className="bg-white rounded-lg p-2 hover:bg-slate-300">Home</Link>
    <Link href="/login" className="bg-white rounded-lg p-2 hover:bg-slate-300">Login</Link>
    <Link href="/register" className="bg-white rounded-lg p-2 hover:bg-slate-300">Register</Link>
    </div>
    
    </>
  );
}
