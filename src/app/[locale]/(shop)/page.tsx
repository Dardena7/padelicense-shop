import { getTranslations, setRequestLocale } from "next-intl/server";

type HomeProps = {
  params: Promise<{ locale: string }>;
};

const Home = async (props: HomeProps) => {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("metadata.home");

  return (
    <main className="flex flex-1 items-center justify-center">
      <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
    </main>
  );
};

export default Home;
