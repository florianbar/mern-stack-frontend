import Link from "next/link";
import { useRouter } from "next/router";

import { removeToken } from "../../utils/auth";

export const Layout = ({ children, loggedIn }) => {
  const router = useRouter();

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-red-500 text-white">
        <h1 className="text-3xl font-bold">Places</h1>
        <div>
          <nav>
            <ul className="flex space-x-3">
              {loggedIn && (
                <li>
                  <Link href="/" className="p-2 hover:bg-red-400">
                    My Places
                  </Link>
                </li>
              )}
              {loggedIn && (
                <li>
                  <Link href="/add-place" className="p-2 hover:bg-red-400">
                    Add Place
                  </Link>
                </li>
              )}
              <li>
                <Link href="/users" className="p-2 hover:bg-red-400">
                  All Users
                </Link>
              </li>
              <li>
                {loggedIn ? (
                  <button
                    className="p-2 border border-white hover:bg-red-400"
                    type="button"
                    onClick={() => {
                      removeToken();
                      router.push("/auth");
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/auth"
                    className="p-2 border border-white hover:bg-red-400"
                  >
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="p-4">{children}</main>
    </>
  );
};
