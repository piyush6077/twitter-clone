import { useQuery } from "@tanstack/react-query";
import Post from "../../common/Post";
import PostSkeleton from "../../skeletons/PostSkelation";
import { useEffect } from "react";

const Posts = ({feedType , username, userId}) => {

	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return "/api/post/all"
		    case "following":
				return "/api/post/following"
			case "posts":
				return `/api/post/user/${username}`
			case "likes":
				return `/api/post/likes/${userId}`
			default:
				return "/api/post/all"
		}
	}

	const POST_ENDPOINT = getPostEndpoint();
	
	const { data: posts , isLoading, refetch ,isRefetching } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT,{
					credentials: "include"
				})
				console.log(res)
				const data = await res.json()
				console.log(data)
	
				if(!res.ok) {
					throw new Error(data.error || "Something went wrong")
				}
				
				return data.data || []; 
			}
			catch (error) {
				throw new Error(error)	
			}
		}
	})

	useEffect(() => {
		refetch();
	},[feedType , refetch , username, userId])
	
	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;