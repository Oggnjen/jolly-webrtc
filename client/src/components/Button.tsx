export const Button = ({ text, onClick }: { text: string; onClick: () => void }) => {
  return (
    <button onClick={onClick} className='border px-4 rounded-xl bg-white cursor-pointer'>
      {text}
    </button>
  );
};
