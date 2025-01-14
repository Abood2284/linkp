import DashboardClient from "./client";

type DashboardParams = {
  slug: string;
};

export default async function DashboardPage(props: {
  params: Promise<DashboardParams>;
}) {
  const params = await props.params;
  console.log("Params: ", params);
  const { slug } = params;

  return <DashboardClient slug={slug} />;
}
