"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/server/actions/auth.actions";
import {
  FiHome,
  FiBook,
  FiBarChart2,
  FiLogOut,
  FiPlusCircle,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { FaLanguage } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white text-stone-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-1 flex items-center justify-center sm:items-center sm:justify-start">
            <Link
              href="/dashboard"
              className="flex items-center justify-center space-x-2"
            >
              <FaLanguage className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-gray-900">LangPath</span>
            </Link>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                {links.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === link.href
                        ? "bg-primary text-primary-foreground"
                        : "text-stone-500 hover:bg-accent hover:text-accent-foreground"
                    }`}
                    aria-label={link.alt}
                  >
                    {link.icon}
                    <span className="ml-2">{link.text}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button
              variant="destructive"
              onClick={() => logout()}
              className="flex items-center"
            >
              <FiLogOut className="mr-2" />
              Logout
            </Button>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FiX className="h-6 w-6" aria-hidden="true" />
              ) : (
                <FiMenu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="sm:hidden"
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    pathname === link.href
                      ? "bg-primary text-primary-foreground"
                      : "text-stone-500 hover:bg-accent hover:text-accent-foreground"
                  }`}
                  aria-label={link.alt}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  <span className="ml-2">{link.text}</span>
                </Link>
              ))}
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
              >
                <FiLogOut className="mr-2" />
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const links = [
  {
    href: "/dashboard",
    text: "Home",
    alt: "Home page",
    icon: <FiHome className="w-5 h-5" />,
  },
  {
    href: "/dashboard/plans",
    text: "Plans",
    alt: "Language plans",
    icon: <FiBook className="w-5 h-5" />,
  },
  {
    href: "/dashboard/progress",
    text: "Progress",
    alt: "Learning progress",
    icon: <FiBarChart2 className="w-5 h-5" />,
  },
  {
    href: "/dashboard/new-plan",
    text: "New Plan",
    alt: "Create new plan",
    icon: <FiPlusCircle className="w-5 h-5" />,
  },
];

export default Navigation;
