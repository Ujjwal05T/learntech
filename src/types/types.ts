export interface VideoCardProps {
	videoSrc: string;
	title: string;
	authorName: string;
	aboutAuthor: string;
	description: string;
	views: string;
	uploadedTime: string;
}

export interface Roadmaps {
	id: number;
	slug: string;
	title: string;
	description: string;
	time: string;
	difficulty: string;
	preRequisites: string;
 }

 export interface DetailedRoadmap {
	[key: string]: RoadmapData;
 }
 
 export interface Tech {
	[key: string]: string[];
 }

 export interface Level {
	[key: string]: Tech;
 }
 
export interface RoadmapData {
	[key: string]: Level;
 }

export interface DecodedToken {
	userId: string;
	username: string;
	email: string;
	role: string;
	exp: number;
	iat: number;
 } 
