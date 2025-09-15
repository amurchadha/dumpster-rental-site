import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dumpster Rental Direct - Nationwide Dumpster Service",
  description: "Dumpster Rental Direct provides nationwide dumpster service. Call us for dumpster rental in the US."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div id="wrapper">
          <div id="header">
            <div id="logo">
              <a href="/">
                <img 
                  src="http://www.dumpsterrentaldirect.com/images/dumpster-rental-direct-logo.jpg" 
                  alt="dumpster rental header" 
                  style={{border: 0, maxWidth: '100%', height: 'auto'}}
                />
              </a>
            </div>
          </div>
          
          <div className="navtext" id="nav">
            <div id="menu">
              <a href="/" className="nav">Dumpster Rental</a> | {" "}
              <a href="/dumpster-sizes" className="nav">Dumpster Sizes</a> | {" "}
              <a href="/about" className="nav">About</a> | {" "}
              <a href="/by-state" className="nav">By State</a> | {" "}
              <a href="/contact" className="nav">Contact</a>
            </div>
          </div>
          
          <div id="content">
            {children}
          </div>
          
          <div id="footer">
            <p>Call Dumpster Rental Direct Today For Dumpster Rental</p>
            <p>Dumpster Rental Direct is the Authority on Dumpster Rental</p>
          </div>
        </div>
      </body>
    </html>
  );
}