export default function Card({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full rounded-3xl flex flex-col border-border border bg-neutral-100">
      <div className="relative w-full h-75 bg-neutral-50 rounded-3xl">
        {children}
      </div>
      <div className="p-5 flex flex-col gap-1 grow">
        <h2 className="text-base md:text-lg lg:text-xl font-bold line-clamp-1">
          {title}
        </h2>
        <p className="text-xs lg:text-sm text-gray-500 line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}
