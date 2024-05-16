import { useLoaderData } from "remix";
import { getProjects } from "~/projects";
import invariant from "tiny-invariant";

const parseBody = (str) => {
  return str.replace(/\n/g, "<br />");
};

export let loader = async ({ params, request }) => {
  invariant(params.slug, "expected params.slug");

  return getProjects({ request, slug: params.slug });
};

export default function ProjectSlug() {
  let project = useLoaderData();
  return (
    <div>
      <h2>{project.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: parseBody(project.description) }} />
    </div>
  );
}