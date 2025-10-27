'use client';
import React, { useEffect, useState } from 'react';
import { navigation } from "@/constant";
import { X } from "lucide-react";
import Link from "next/link";

type Props = {
  showNav: boolean;
  closeNav: () => void;
};

const MobileNav = ({ closeNav, showNav }: Props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // Prevent SSR/client mismatch

  const navOpen = showNav ? "translate-x-0" : "-translate-x-full";

  return (
    <div>
      {showNav && (
        <div
          onClick={closeNav}
          className="fixed top-0 inset-0 z-[100002] bg-black opacity-70 transition-opacity duration-500"
        />
      )}
      <div
        className={`fixed top-0 left-0 justify-center flex flex-col h-full transform transition-transform duration-500 w-[80%] sm:w-[60%] bg-gray-900 space-y-6 z-[1000050] ${navOpen}`}
      >
        {navigation.map((link) => (
          <Link onClick={closeNav} key={link.name} href={link.href}>
            <p className="text-white w-fit text-2xl ml-12 border-b-[1.5px] pb-2 border-white sm:text-[30px]">
              {link.name}
            </p>
          </Link>
        ))}
        <Link
          onClick={closeNav}
          href="/want-to-know"
          className="text-white w-fit text-2xl ml-12 border-b-[1.5px] pb-2 border-white sm:text-[30px]"
        >
          <span className="text-2xl font-medium whitespace-nowrap">
            Want to Know?
          </span>
        </Link>
        <X
          onClick={closeNav}
          className="absolute top-[0.7rem] right-[1.4rem] sm:w-8 sm:h-8 w-6 h-6 cursor-pointer text-white"
        />
      </div>
    </div>
  );
};

export default MobileNav;
