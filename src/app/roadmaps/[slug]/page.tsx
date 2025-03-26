import { Button } from "@/components/ui/button";
import roadmapData from "@/data/data.json";
import slugData from "@/data/index.json";
import Link from "next/link";
import ErrorPage from "@/components/ErrorPage";
import { Roadmaps, DetailedRoadmap, RoadmapData } from "@/types/types";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
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
  const roadmap: RoadmapData = roadmaps[slug];
  const response: Roadmaps = slugData.roadmaps.filter(
    (title) => title.slug === slug
  )[0];

  if (!roadmap) {
    return <ErrorPage />;
  }

  return (
    <>
      <div className="bg-black">
        <div>
          <div className="text-center text-2xl text-white font-bold py-6 sm:py-8">
            {response.title} Roadmap
          </div>
        </div>
        <div>
          <div>
            {Object.keys(roadmap).map((level) => (
              <>
                <div className="flex justify-center" key={level}>
                  <div className="border-2 border-slate-700 bg-slate-800/50 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 px-4 py-3 text-lg rounded-lg w-[90%] sm:w-[70%] md:w-[80%] lg:w-[60%] mx-2 sm:mx-auto hover:shadow-blue-500/10">
                    <div className="font-sans text-white text-xl mb-4">
                      <h1> {level}</h1>
                    </div>
                    <div className="mt-2 flex flex-col md:flex-row gap-2 justify-center md:items-center">
                      {Object.keys(roadmap[level]).map((tech) => (
                        <>
                          <Drawer>
                            <DrawerTrigger asChild>
                              <Button variant="outline" className="hover:bg-slate-700/50 bg-blue-500/10 text-white hover:text-white border border-slate-600 hover:border-blue-400/50 transition-colors duration-300" key={tech}>{tech}</Button>
                            </DrawerTrigger>
                            <DrawerContent className="bg-slate-900 border-t border-slate-700">
                              <div className="max-w-3xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
                                <DrawerHeader className="mb-2 sm:mb-4">
                                  <DrawerTitle className="text-lg sm:text-2xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                                    {tech} Topics
                                  </DrawerTitle>
                                </DrawerHeader>

                                <div className="space-y-4 sm:space-y-6">
                                  {Object.keys(roadmap[level][tech]).map(
                                    (items) => (
                                      <DrawerDescription
                                        key={items}
                                        className="text-slate-400">
                                        <div className="bg-slate-800/50 rounded-lg p-2 sm:p-4 backdrop-blur-sm">
                                          <h3 className="font-bold text-lg text-white mb-1 sm:mb-3 capitalize">
                                            {items}
                                          </h3>
                                          <div className="flex flex-wrap gap-2">
                                            {roadmap[level][tech][items].map(
                                              (item: string) => (
                                                <span
                                                  key={item}
                                                  className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-xs sm:text-sm hover:bg-blue-500/20 transition-colors">
                                                  {item}
                                                </span>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      </DrawerDescription>
                                    )
                                  )}
                                </div>
                              </div>
                            </DrawerContent>
                          </Drawer>
                          <div className="hidden md:flex text-slate-400">
                            <MoveRight className="w-5 h-5" />
                          </div>
                          <div className="md:hidden text-slate-400 flex justify-center items-center m-1">
                            <MoveDown className="w-5 h-5" />
                          </div>
                        </>
                      ))}
                      <Button  className="my-2 bg-green-600 hover:bg-green-700 transition-all duration-300">Completed</Button>
                    </div>
                  </div>
                </div>
                <div className="flex text-slate-400 justify-center my-6">
                  <MoveDown className="w-6 h-6" />
                </div>
              </>
            ))}
            <div className="flex justify-center mt-6 sm:mt-12">
              <div className="px-4 py-3 w-full sm:w-[60%] md:w-[50%] mx-auto">
                <Link href="/roadmaps">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300">
                    Explore Other Tech Stacks
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
