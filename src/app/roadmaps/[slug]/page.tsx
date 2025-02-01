import roadmapData from '@/data/data.json';

interface PageProps {
  params: {
    slug: string;
  }
}

interface Roadmap{
  [key: string]: {}
}

export default function RoadmapPage({ params }: PageProps) {
  const { slug } = params;
  const roadmaps : Roadmap = roadmapData;

  if (!roadmaps[slug]) {
    return <div className='text-red-500'>Roadmap not found</div>;
  }

  const ArrowDown = () => (
    <div className="flex justify-center my-4">
      <svg width="40" height="40" viewBox="0 0 24 24" className="text-gray-400 animate-bounce">
        <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
      </svg>
    </div>
  );

  return (
    <div>
      <h1>Current Roadmap: {slug}</h1>
      <ArrowDown />
    </div>
  )
}
