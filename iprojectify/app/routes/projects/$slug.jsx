import { useLoaderData } from "remix";
import { getProjects } from "~/projects";

const parseBody = (str) => {
  return str.replace(/\n/g, "<br />");
};

export async function loader({ request }) {
  let slug = request.params.slug;
  let projects = await getProjects();
  let project = projects.find((project) => project.slug === slug);
  return project;
}

export default function ProjectSlug() {
  let project = useLoaderData();
  return (
    <div>
      <h2>{project.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: parseBody(project.description) }} />
    </div>
  );
}