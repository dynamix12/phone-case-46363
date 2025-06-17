"use client";

import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";

const ClientNavbar = () => {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const [mounted, setMounted] = useState(false);
  const [serverAuthState, setServerAuthState] = useState<{
    isAuthenticated: boolean;
    user: any;
    isAdmin: boolean;
  } | null>(null);

  useEffect(() => {
    setMounted(true);

    // Check server-side authentication state
    const checkServerAuth = async () => {
      try {
        const response = await fetch("/api/auth/check-session");
        if (response.ok) {
          const data = await response.json();
          setServerAuthState(data);
        }
      } catch (error) {
        console.log("Failed to check server auth state:", error);
      }
    };

    checkServerAuth();
  }, []);

  // Use server auth state if client state is not available
  const effectiveIsAuthenticated =
    isAuthenticated || serverAuthState?.isAuthenticated || false;
  const effectiveUser = user || serverAuthState?.user || null;
  const isAdmin =
    effectiveUser?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
    serverAuthState?.isAdmin ||
    false;

  // Show loading state while checking authentication
  if (!mounted || (isLoading && !serverAuthState)) {
    return (
      <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
        <MaxWidthWrapper>
          <div className="flex h-14 items-center justify-between border-b border-zinc-200">
            <Link href="/" className="flex z-40 font-semibold">
              case<span className="text-green-600">cobra</span>
            </Link>
            <div className="h-full flex items-center space-x-4">
              <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </MaxWidthWrapper>
      </nav>
    );
  }

  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            case<span className="text-green-600">cobra</span>
          </Link>

          <div className="h-full flex items-center space-x-4">
            {effectiveIsAuthenticated && effectiveUser ? (
              <>
                <Link
                  href="/api/auth/logout"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Sign out
                </Link>
                {isAdmin ? (
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    Dashboard ✨
                  </Link>
                ) : null}
                <Link
                  href="/configure/upload"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  Create case
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/api/auth/register"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Sign up
                </Link>

                <Link
                  href="/api/auth/login"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Login
                </Link>

                <div className="h-8 w-px bg-zinc-200 hidden sm:block" />

                <Link
                  href="/configure/upload"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  Create case
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default ClientNavbar;
