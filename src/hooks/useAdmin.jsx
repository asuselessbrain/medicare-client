import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxios from './useAxios';

const useAdmin = () => {
    const {user, loading} = useAuth()
    const axios = useAxios()
    
    const {data: isAdmin, isPending: isAdminPending} = useQuery({
        queryKey:[user?.email, 'isAdmin'],
        enabled: !loading && !!user?.email,
        queryFn: async()=>{
            const {data} = await axios.get(`/verify-user/${user?.email}`)
            return data
        }
    })
    if (isAdmin==='admin') {
        const admin = true
        return [admin,isAdminPending]
    } else{
        const admin = false
        return [admin,isAdminPending]
    }
};

export default useAdmin;