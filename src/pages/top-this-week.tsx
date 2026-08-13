import { GetServerSideProps } from "next";

/** Permanent redirect from the old /top-this-week path. */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const period = context.query.period;
  const query =
    typeof period === "string"
      ? `?period=${encodeURIComponent(period)}`
      : "";

  return {
    redirect: {
      destination: `/top${query}`,
      permanent: true,
    },
  };
};

export default function TopThisWeekRedirect() {
  return null;
}
