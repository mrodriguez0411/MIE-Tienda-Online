interface Props {
	content: string;
}

export const ProductTable = ({ content }: Props) => {
	return (
		<td className='p-4 font-medium tracking-tighter'>{content}</td>
	);
};