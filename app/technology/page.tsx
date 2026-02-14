import Link from "next/link";

export default function Technology() {
  return (
    <div>
      <h1>Techno Page</h1>
      <Link href="/calculator">Calculator</Link>
      <Link href="/help">Help</Link>
      <Link href="/user-data">User Data</Link>
    </div>
  );
}
