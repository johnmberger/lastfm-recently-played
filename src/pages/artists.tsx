import { GetServerSideProps } from "next";

/** Permanent redirect from the old /artists path. */
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/top",
      permanent: true,
    },
  };
};

export default function ArtistsRedirect() {
  return null;
}
