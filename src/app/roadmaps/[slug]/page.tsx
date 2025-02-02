import { Button } from "@/components/ui/button";
import roadmapData from "@/data/data.json";
import slugData from "@/data/index.json";
import Link from "next/link";
import ErrorPage from "@/components/ErrorPage";

interface PageProps {
  params: {
    slug: string;
  };
}

interface Roadmaps {
  id: number;
  slug: string;
  title: string;
  description: string;
  time: string;
  difficulty: string;
  preRequisites: string;
}

interface Roadmap {
  [key: string]: RoadmapData;
}

interface Level {
  [key: string]: string[];
}

interface RoadmapData {
  [key: string]: Level;
}

const TechnologyList = ({ items }: { items: string[] }) => (
  <div className="grid grid-cols-2 gap-2 mt-2">
    {items.map((item) => (
      <div key={item} className="bg-white/20 px-3 py-1 rounded text-sm">
        {item}
      </div>
    ))}
  </div>
);

export default function RoadmapPage({ params }: PageProps) {
  const { slug } = params;
  const roadmaps: Roadmap = roadmapData;
  const roadmap = roadmaps[slug];
  const response: Roadmaps = slugData.roadmaps.filter(
    (title) => title.slug === slug
  )[0];

  if (!roadmap) {
    return <ErrorPage />;
  }

  const ArrowDown = () => (
    <div className="flex justify-center my-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-move-down">
        <path d="M8 18L12 22L16 18" />
        <path d="M12 2V22" />
      </svg>
    </div>
  );

  const Arrow = () => (
    <div className="text-gray-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-move-right">
        <path d="M18 8L22 12L18 16" />
        <path d="M2 12H22" />
      </svg>
    </div>
  );

  return (
    <>
      <div>
        <div className="text-center text-2xl font-bold my-4">
          {response.title} Roadmap
        </div>
      </div>
      <div>
        <div>
          {Object.keys(roadmap).map((level) => (
            <>
              <div className="flex justify-center">
                <div className="border-2 px-4 py-3 text-lg rounded-lg w-full sm:w-[60%] md:w-[50%] mx-2 sm:mx-auto">
                  <div className="font-sans text-xl">
                    <h1> {level}</h1>
                  </div>
                  <div className="mt-2 flex flex-col md:flex-row space-x-2 justify-center md:items-center">
                    {Object.keys(roadmap[level]).map((tech) => (
                      <>
                      <div className="hidden">

                      </div>
                        <Button>{tech}</Button>
                        <div className="hidden md:flex">
                        <Arrow />
                        </div>
                        <div className="md:hidden">
                        <ArrowDown />
                        </div>  
                      </>
                    ))}
                    <Button className="my-4">Completed</Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-center my-4">
                <ArrowDown />
              </div>
            </>
          ))}
          <div className="flex justify-center">
            <div className="px-4 py-3 text-lg text-center rounded-lg w-full sm:w-[60%] md:w-[50%] mx-auto">
              <Link href="/roadmaps">
                <Button>Explore Other Tech Stacks</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
