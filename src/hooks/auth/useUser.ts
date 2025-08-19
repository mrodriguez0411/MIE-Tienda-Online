import { useQuery } from '@tanstack/react-query';
import { getSession } from '../../actions';

export const useUser = () => {
	const { data, isLoading } = useQuery({
		queryKey: ['user'],
		queryFn: getSession,
		retry: false,
		refetchOnWindowFocus: true,
	});

	const user = data?.session?.user;

	return {
		session: data?.session,
		user,
		isLoading,
	};
};