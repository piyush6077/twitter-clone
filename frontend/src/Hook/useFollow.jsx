import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";


const useFollow = () => {    
    const queryClient = useQueryClient()
    const [followingId , setFollowingId] = useState(null)

    const {mutate: followed , isPending } = useMutation({
        mutationFn: async(userId) => {
            setFollowingId(userId)

            const res = await fetch(`/api/user/follow/${userId}`, {
                method: "POST"
            })
            const data = await res.json()

            console.log(data)
            if(!res.ok){
                throw new Error(error.message || "Something got wrong")
            }

            return data
        },
        onSuccess: ()=>{
            // So they can run at a same time
            Promise.all([
                queryClient.invalidateQueries({queryKey: ['SuggestedUser']}),
                queryClient.invalidateQueries({queryKey: ['authUser']}),
                queryClient.invalidateQueries({queryKey: ['userDetails']})
            ])
        },
        onSettled: ()=>{
            setFollowingId(null)
        },
        onError: (err) => {
            throw new Error(err.message)
        }
    })

    return { followed , isPending , followingId}
}

export default useFollow