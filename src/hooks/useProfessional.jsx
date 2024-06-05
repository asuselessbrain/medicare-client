import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxios from './useAxios';

const useProfessional = () => {
    const {user, loading} = useAuth()
    const axios = useAxios()
    
    const {data: isProfessional, isPending: isProfessionalPending} = useQuery({
        queryKey:[user?.email, 'isProfessional'],
        enabled: !!user?.email && !loading,
        queryFn: async()=>{
            const {data} = await axios.get(`/verify-user/${user?.email}`)
            return data
        }
    })
    
    if (isProfessional==='healthcare_professional') {
        const professional = true
        return [professional,isProfessionalPending]
    } else{
        const professional = false
        return [professional,isProfessionalPending]
    }
};

export default useProfessional;