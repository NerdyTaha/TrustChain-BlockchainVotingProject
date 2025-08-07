import {
  IconBolt,
  IconCheck,
  IconShieldCheck,
  IconUserShield,
} from "@tabler/icons-react";

const features = [
  {
    title: "Secure & Reliable",
    description:
      "Built with cutting-edge security protocols to ensure safe transactions and data protection.",
    icon: <IconShieldCheck size={40} className="text-primary" />,
  },
  {
    title: "User-Friendly Interface",
    description:
      "Intuitive and responsive design for a seamless user experience.",
    icon: <IconUserShield size={40} className="text-success" />,
  },
  {
    title: "Lightning-Fast Performance",
    description:
      "Optimized for speed, ensuring quick and hassle-free operations.",
    icon: <IconBolt size={40} className="text-warning" />,
  },
  {
    title: "Verified Listings",
    description:
      "All listings go through an approval process to maintain authenticity and trust.",
    icon: <IconCheck size={40} className="text-error" />,
  },
];

const FeaturesPage = () => {
  return (
    <section className="py-12 px-6 bg-base-100 min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-base-content">
          Our Key Features
        </h2>
        <p className="mt-4 text-base-content/60">
          Explore the powerful features that make our platform stand out.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-base-200 shadow-lg rounded-xl flex flex-col items-center text-center transition-transform duration-300 hover:scale-105"
          >
            {feature.icon}
            <h3 className="mt-4 text-xl font-semibold text-base-content">
              {feature.title}
            </h3>
            <p className="mt-2 text-base-content">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesPage;
