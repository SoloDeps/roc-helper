import Link from "next/link";

export default function UserData() {
  return (
    <div>
      <h1>My Game Data</h1>
      <Link href="/calculator">Calculator</Link>
      <Link href="/help">Help</Link>
      <Link href="/user-data">User Data</Link>
    </div>
  );
}
