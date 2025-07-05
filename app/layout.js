import "./globals.css";
import NavBar from "./Components/navbar/NavBar";
import { PostsContextProvider } from "./context/PostContext";
import ClientProviders from "./ClientProviders";

export const metadata = {
  title: "A",
  description: "Welcome to A, a social media platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <PostsContextProvider>
            <NavBar />
            <div className="h-16" />
            {children}
          </PostsContextProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
