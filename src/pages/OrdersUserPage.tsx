import { Link} from 'react-router-dom';
import { TableOrders } from '../components/orders/TableOrders';
import { useOrders } from '../hooks';
import { Loader } from '../components/shared/Loader';
import { useUser } from '../hooks';
import { useEffect, useState } from 'react';

export const OrdersUserPage = () => {
	const {data: orders , isLoading} = useOrders();
	//const navigate = useNavigate();
	const { user } = useUser();
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		if (user) {
			const role = user.user_metadata?.role;
			setIsAdmin(role === 'admin');
		}
	}, [user]);

	if(isLoading || !orders) return <Loader/>
	return (
		<div className='flex flex-col gap-6 items-center'>
			<div className='flex gap-2'>
				<h1 className='text-3xl font-bold'>Pedidos</h1>
				<span className='w-7 h-7 rounded-full bg-cyan-700 text-white text-[13px] flex justify-center items-center mt-1'>
					{orders.length}
				</span>
				{isAdmin && (
					<Link
						to='/dashboard'
						className='bg-black text-white uppercase font-semibold tracking-widest text-xs py-4 rounded-full px-8'
					>
						Dashboard
					</Link>
				)}
			</div>

			{orders.length === 0 ? (
				<>
					<p className='text-slate-600 text-[13px]'>
						Todavía no has hecho ningún pedido
					</p>
					<Link
						to='/productos'
						className='bg-black text-white uppercase font-semibold tracking-widest text-xs py-4 rounded-full px-8'
					>
						Empezar a comprar
					</Link>
				</>
			) : (
				<TableOrders orders={orders}/>
			)}
		</div>
	);
};