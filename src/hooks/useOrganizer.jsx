import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxios from './useAxios';

const useOrganizer = () => {
    const {user, loading} = useAuth()
    const axios = useAxios()
    
    const {data: isOrganizer, isPending: isOrganizerPending} = useQuery({
        queryKey:[user?.email, 'isOrganizer'],
        enabled: !loading && !!user?.email,
        queryFn: async()=>{
            const {data} = await axios.get(`/verify-user/${user?.email}`)
            return data
        }
    })
    if (isOrganizer==='organizer') {
        const organizer = true
        return [organizer,isOrganizerPending]
    } else{
        const organizer = false
        return [organizer,isOrganizerPending]
    }
};

export default useOrganizer;