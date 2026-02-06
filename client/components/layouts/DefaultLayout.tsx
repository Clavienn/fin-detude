import React from 'react'
import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";


interface LayoutsProps {
  children: React.ReactNode;
}

function DefaultLayout({children }: LayoutsProps) {
  return (
    <div>
        <Header />
            {children}
        <Footer />
    </div>
  )
}

export default DefaultLayout