import { Button } from "@/components/ui/button";
import roadmapData from "@/data/data.json";
import slugData from "@/data/index.json";
import Link from "next/link";
import ErrorPage from "@/components/ErrorPage";
import { Roadmaps, DetailedRoadmap, RoadmapData } from "@/types/types";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MoveDown, MoveRight } from "lucide-react";

interface PageProps {
  params: {
    slug: string;
  };
}


export default async function RoadmapPage({ params }: PageProps) {
  const { slug } = await params;
  const roadmaps: DetailedRoadmap = roadmapData;
  const roadmap:RoadmapData = roadmaps[slug];
  const response: Roadmaps = slugData.roadmaps.filter(
    (title) => title.slug === slug
  )[0];

  if (!roadmap) {
    return <ErrorPage />;
  }

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
              <div className="flex justify-center" key={level}>
                <div className="border-2 bg-gray-100 px-4 py-3 text-lg rounded-lg w-[90%] sm:w-[70%] md:w-[70%] lg:w-[60%] mx-2 sm:mx-auto">
                  <div className="font-sans text-xl">
                    <h1> {level}</h1>
                  </div>
                  <div className="mt-2 flex flex-col md:flex-row space-x-2 justify-center md:items-center">
                    {Object.keys(roadmap[level]).map((tech) => (
                      <>
                        <div className="hidden"></div>
                        <Drawer>
                          <DrawerTrigger asChild>
                            <Button variant="outline">{tech}</Button>
                          </DrawerTrigger>
                          <DrawerContent>
                            <div className="mx-auto sm:w-xl">
                              <DrawerHeader>
                                <DrawerTitle className="text-center underline m-3 text-xl">
                                  {tech} Topics
                                </DrawerTitle>
                                <div>
                                  {Object.keys(roadmap[level][tech]).map(
                                    (items) => (
                                      <DrawerDescription>
                                        <div className="flex space-x-2 w-">
                                          <div className="font-bold mx-2 capitalize">
                                            {items} :
                                          </div>
                                          {roadmap[level][tech][items].map(
                                            (item: string) => (
                                              <div className="mx-2 ">
                                                {item},
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </DrawerDescription>
                                    )
                                  )}
                                </div>
                              </DrawerHeader>
                              <DrawerFooter>
                                <DrawerClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DrawerClose>
                              </DrawerFooter>
                            </div>
                          </DrawerContent>
                        </Drawer>
                        <div className="hidden md:flex">
                        <MoveRight />
                        </div>
                        <div className="md:hidden">
                          <MoveDown />
                        </div>
                      </>
                    ))}
                    <Button className="my-4">Completed</Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-center my-4">
                <MoveDown />
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
