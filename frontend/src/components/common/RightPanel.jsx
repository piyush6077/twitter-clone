import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkelation";
// import { USERS_FOR_RIGHT_PANEL } from "../utils/db/dummy";
import { useQuery } from "@tanstack/react-query";
// import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import useFollow from "../../Hook/useFollow";

const RightPanel = () => {

	const {data: suggestedUser , isLoading } = useQuery({
		queryKey: ["SuggestedUser"],
		queryFn: async() => {
			try {
				const res = await fetch("/api/user/suggested")
				const data = res.json()
				console.log(data)
	
				if(!res.ok){
					throw new Error(error.message || "Something went wrong")
				}
				return data
			} catch (error) {
				throw new Error(error.message)
			}
		},
	})

	const { followed , isPending , followingId} = useFollow()


	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						suggestedUser?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.fullName}
										</span>
										<span className='text-sm text-slate-500'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {
											e.preventDefault()
											followed(user._id)
										}}
										disabled={isPending && followingId === user._id}
									>
										{isPending && followingId === user._id ? <LoadingSpinner size="sm"/> : "Follow"}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;