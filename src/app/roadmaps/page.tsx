import React from "react";
import roadmapsData from "@/data/index.json";

interface Roadmap {
  id: number;
  title: string;
  description: string;
  time: string;
  difficulty: string;
  preRequisites: string;
}
export default function Roadmaps() {
  return (
    <>
      <h1 className="text-4xl font-bold text-center mt-3 text-gray-600 font-sans">
        Tech Roadmaps
      </h1>
      <div className="flex flex-row justify-center items-center my-4">
        <div className="flex items-center text-center justify-center w-2/3">
          <p>
            Here are some of the most popular roadmaps that you can follow to
            become a successful developer. These roadmaps are community-driven
            and are designed to help you navigate your tech journey and make
            informed decisions about your learning path.
          </p>
        </div>
      </div>

      <hr />
      <div>
        {roadmapsData.roadmaps.map((roadmap: Roadmap) => (
          <div className="flex flex-row justify-center items-center mt-2">
            <div className="border-2 border-gray-200 hover:border-gray-400 rounded-lg pt-1  px-4 mx-2 my-2 w-1/4">
              <div>
                <div className="flex flex-row justify-between text-gray-400 text-sm">
                  <div>{roadmap.time}</div>
                  <div>{roadmap.difficulty}</div>
                </div>
              </div>
              <div className="flex justify-center items-center my-2">
                <div className="">
                  <h2 className="font-sans text-3xl font-semibold">
                    {roadmap.title}
                  </h2>
                </div>
              </div>
              <div>
                <div className="text-sm mt-3">
                  <p className="text-sm text-gray-400">{roadmap.description}</p>
                </div>
              </div>
              <div>
                <div className="flex flex-row space-x-2 my-3 text-sm text-gray-500">
                  <h2>Prerequisites:</h2>
                  <p>{roadmap.preRequisites}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
