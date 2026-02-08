import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-0 flex-1 container-wrapper gap-4">
      <div className="flex flex-col space-y-4 mt-14">
        <Link href="/user-data">User Data</Link>
        <Link href="/technologies">Technologies</Link>
        <Link href="/calculator">Calculator</Link>
        <Link href="/help">Help</Link>
      </div>
    </div>
  );
}
