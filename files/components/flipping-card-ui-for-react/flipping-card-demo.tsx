import { FlippingCard } from "@/components/flipping-card";

interface CardData {
  id: string;
  front: {
    imageSrc: string;
    imageAlt: string;
    title: string;
    description: string;
  };
  back: {
    description: string;
    buttonText: string;
  };
}

const cardsData: CardData[] = [
  {
    id: "product-design",
    front: {
      imageSrc:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=420&fit=crop",
      imageAlt: "Product Design Sprint",
      title: "Product Design Sprint",
      description:
        "Build clear user flows and modern interfaces with fast design iterations.",
    },
    back: {
      description:
        "From wireframes to polished UI, we help teams validate ideas quickly and ship experiences users love.",
      buttonText: "See Case Study",
    },
  },
  {
    id: "frontend-performance",
    front: {
      imageSrc:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=420&fit=crop",
      imageAlt: "Frontend Performance",
      title: "Frontend Performance",
      description:
        "Optimize rendering, improve loading, and deliver a smooth user experience.",
    },
    back: {
      description:
        "We improve Core Web Vitals, reduce bundle size, and keep interactions snappy across devices.",
      buttonText: "Improve Speed",
    },
  },
  {
    id: "growth-experiments",
    front: {
      imageSrc:
        "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&h=420&fit=crop",
      imageAlt: "Growth Experiments",
      title: "Growth Experiments",
      description:
        "Launch and measure product experiments to increase activation and retention.",
    },
    back: {
      description:
        "We design testable hypotheses, define metrics, and help your team move from guesswork to evidence.",
      buttonText: "Start Testing",
    },
  },
];

export default function FlippingCardDemo() {
  return (
    <div className="flex min-h-screen flex-wrap items-center justify-center gap-6 bg-slate-50 p-8 md:p-12">
      {cardsData.map((card) => (
        <FlippingCard
          key={card.id}
          width={300}
          frontContent={<GenericCardFront data={card.front} />}
          backContent={<GenericCardBack data={card.back} />}
        />
      ))}
    </div>
  );
}

interface GenericCardFrontProps {
  data: CardData["front"];
}

function GenericCardFront({ data }: GenericCardFrontProps) {
  return (
    <div className="flex h-full w-full flex-col p-4">
      <img
        src={data.imageSrc}
        alt={data.imageAlt}
        className="h-auto min-h-0 w-full flex-grow rounded-xl object-cover"
      />
      <div className="p-2">
        <h3 className="mt-2 text-base font-semibold text-slate-900">
          {data.title}
        </h3>
        <p className="mt-2 text-[13.5px] text-slate-600">{data.description}</p>
      </div>
    </div>
  );
}

interface GenericCardBackProps {
  data: CardData["back"];
}

function GenericCardBack({ data }: GenericCardBackProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <p className="mt-2 text-center text-[13.5px] text-slate-600">
        {data.description}
      </p>
      <button className="mt-6 flex h-9 w-min items-center justify-center whitespace-nowrap rounded-lg bg-slate-900 px-4 py-2 text-[13.5px] font-medium text-white hover:bg-slate-800">
        {data.buttonText}
      </button>
    </div>
  );
}
