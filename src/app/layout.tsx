import { Metadata } from "next";
import { Inter, Lusitana } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/useContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "700"],
});

const lusitana = Lusitana({
  subsets: ["latin"],
  variable: "--font-lusitana",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "OAK&TEAK Admin Dashboard",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (

      <html lang="en" className="scroll-smooth antialiased" suppressHydrationWarning>
         <UserProvider>
        <body className={`${inter.variable} ${lusitana.variable} antialiased`}>
       {children}
        </body>
        </UserProvider>
      </html>
    
  );
}
