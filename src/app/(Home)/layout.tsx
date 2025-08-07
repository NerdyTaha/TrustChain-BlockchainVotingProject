"use client";
import "../globals.css";
import Header from "@/Components/Header";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@/context/UserContext";

const Component = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <title>TrustChain - Decentralized Voting System</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="TrustChain is a secure, blockchain-based voting system using Ethereum, Next.js, ethers.js, and MongoDB. It ensures transparent elections where only verified candidates and voters participate. Votes and candidates are stored on Ganache blockchain, while other election data is managed in MongoDB. Features include Metamask-based authentication, role-based access, and OTP email verification for voter registration. The admin panel manages elections, verifies candidates, and declares results after voting ends."
        />
      </head>
      <body className={`antialiased`}>
        <Header />
        <Toaster />
        {children}
      </body>
    </html>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <Component>{children}</Component>
    </UserProvider>
  );
}
