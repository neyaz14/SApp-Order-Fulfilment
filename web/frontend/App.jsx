import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";

import { QueryProvider, PolarisProvider } from "./components";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", {
    eager: true,
  });
  const { t } = useTranslation();

  return (
    <PolarisProvider>
      <BrowserRouter>
        <QueryProvider>
          <NavMenu>
            <a href="/" rel="home" />
            <a href="/pagename">{t("Credentials Input")}</a>
            <a href="/product">{t("All Products")}</a>
            <a href="/order">{t("All Orders")}</a>
            <a href="/orderwithPagination">{t("All Orders with Pagination")}</a>
          </NavMenu>
          <Routes pages={pages} />
        </QueryProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
