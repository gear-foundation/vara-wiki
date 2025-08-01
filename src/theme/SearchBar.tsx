import React from "react";
import SearchBar from "@theme-original/SearchBar";
import AskCookbook from "@cookbookdev/docsbot/react";
import BrowserOnly from "@docusaurus/BrowserOnly";

/** It's a public API key, so it's safe to expose it here */
const COOKBOOK_PUBLIC_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmMzY2VhM2JkYTMwNmM1MmExZTQxNjciLCJpYXQiOjE3MjQxMDg0NTEsImV4cCI6MjAzOTY4NDQ1MX0.SPAJsOrERvmfu4RpbghDSPe5x93kDhdS2FkIBK13gpw";

export default function SearchBarWrapper(props) {
  return (
    <>
      <SearchBar {...props} />
      <BrowserOnly>
        {() => <AskCookbook apiKey={COOKBOOK_PUBLIC_API_KEY} />}
      </BrowserOnly>
    </>
  );
}
