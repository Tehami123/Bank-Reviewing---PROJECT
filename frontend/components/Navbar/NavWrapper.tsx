// "use client";

// import React, { useState } from 'react'
// import Nav from './Nav'
// import MobileNav from './MobileNav'

// const NavWrapper = () => {
//   const [showNav, setShowNav] = useState(false);

//   const closeNav = () => setShowNav(false);
//   const openNav = () => setShowNav(true);
  
//   return (
//     <div>
//       <Nav openNav={openNav} />
//       <MobileNav showNav={showNav} closeNav={closeNav} />
//     </div>
//   );
// }

// export default NavWrapper


'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Nav from './Nav';
import MobileNav from './MobileNav';

export default function NavWrapper() {
  const [mounted, setMounted] = useState(false);
  const [showNav, setShowNav] = useState(false);

  const closeNav = () => setShowNav(false);
  const openNav = () => setShowNav(true);
  useEffect(() => setMounted(true), []);

 
  return (
   <div>
     <Nav openNav={openNav} />
      <MobileNav showNav={showNav} closeNav={closeNav} />
    </div>
  );
}

