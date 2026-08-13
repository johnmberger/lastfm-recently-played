import { GetServerSideProps } from "next";

/** Old /artists route — keep bookmarks working */
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/top-this-week",
      permanent: true,
    },
  };
};

export default function ArtistsRedirect() {
  return null;
}
