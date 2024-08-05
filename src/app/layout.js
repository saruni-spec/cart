import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import { UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";
import ReactQueryProvider from "./utils/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Cart App",
  description: "Boss it up with a cart app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <CartProvider>
            <ReactQueryProvider>
              <NavBar />
              <main>{children}</main>
            </ReactQueryProvider>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
