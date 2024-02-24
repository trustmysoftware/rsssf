export const InlineCode = ({ children }: { children: string }) => {
  return (
    <code class="bg-slate-100 px-2 py-[0.1rem] rounded-md outline outline-gray-300 outline-1 mx-1">
      {children}
    </code>
  );
};
