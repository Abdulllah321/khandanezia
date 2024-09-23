import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div>
      <Link
        href={`/RegistrationForm`}
        className="px-3 py-2 border rounded bg-foreground hover:bg-current text-background"
      >
        Register
      </Link>
    </div>
  );
}
