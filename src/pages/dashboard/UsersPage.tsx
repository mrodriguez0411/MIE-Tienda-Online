import { useRoleUser } from '../../hooks/auth/useRoleUser';
import UsersTable from '../../components/dashboard/UsersTable';
import { Typography, Box } from '@mui/material';
import { useUser } from '../../hooks/auth/useUser';

export const UsersPage = () => {
  const { session } = useUser();
  const { data: role, isLoading } = useRoleUser(session?.user?.id || '');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (role !== 'admin') {
    return (
      <Box>
        <Typography variant="h5" color="error">
          No tienes permisos para ver esta página
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <UsersTable />
    </Box>
  );
};
