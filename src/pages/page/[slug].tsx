import Link from "next/link";
import Layout from "@/components/layout";
import Container from "@/components/container";
import axios from "axios";
import { TPosts } from "@/types";
import { GetStaticPaths, GetStaticProps } from "next";
import { FC } from "react";
import PostList from "@/components/postlist";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import { NEXT_URL } from "@/utils/all";

type Props = {
  data: TPosts;
};
const Page: FC<Props> = ({ data }) => {
  /*
  If your fallback is set to true you need to handle the fallback state.
 use this to fix >> Build error occurred
Error: Export encountered errors on following paths:
        /page/[slug]
  */
  const router = useRouter();
  if (router?.isFallback) {
    return <Loader />;
  }
  if (data?.meta?.pagination?.page > data?.meta?.pagination?.pageCount) {
    return <Error message="Page not found !" />;
  }

  return (
    <>
      <Layout>
        <Container>
          <div className="grid gap-10 mt-10 lg:gap-10 md:grid-cols-2 xl:grid-cols-3 ">
            {data?.data?.length > 0 &&
              data?.data.map((post) => (
                <PostList
                  key={post.id}
                  post={post}
                  aspect="landscape"
                  preloadImage={false}
                />
              ))}
          </div>
        </Container>
        {data?.meta?.pagination && (
          <Container>
            <div className="space-y-2 pt-6 pb-8 md:space-y-5">
              <nav className="flex justify-between">
                {data?.meta?.pagination?.page > 1 ? (
                  <Link
                    className="cursor-pointer"
                    href={`/page/${data?.meta?.pagination?.page - 1}`}
                  >
                    Previous
                  </Link>
                ) : (
                  <button className="cursor-auto disabled:opacity-50">
                    Previous
                  </button>
                )}
                <span>
                  {data?.meta?.pagination?.page} of{" "}
                  {data?.meta?.pagination?.pageCount}
                </span>
                {data.meta.pagination.pageCount > data.meta.pagination.page ? (
                  <Link href={`/page/${data?.meta?.pagination.page + 1}`}>
                    <button>Next</button>
                  </Link>
                ) : (
                  <button
                    className="cursor-auto disabled:opacity-50"
                    disabled={true}
                  >
                    Next
                  </button>
                )}
              </nav>
            </div>
          </Container>
        )}
      </Layout>
    </>
  );
};

export default Page;

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await axios.get<TPosts>(`${NEXT_URL}/api/posts`);
  const numberOfPages = Math.ceil(data.meta.pagination.pageCount);
  let paths = [...Array(numberOfPages)].map((_page, index) => ({
    params: {
      slug: `${index + 1}`,
    },
  }));
  return {
    paths,
    fallback: true,
  };
};
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data } = await axios.get(
    `${NEXT_URL}/api/posts?populate=*&pagination[page]=${params?.slug}&pagination[pageSize]=10`
  );
  return {
    props: {
      data,
    },
    revalidate: 60,
  };
};